import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type UpsertProfileWorkInput } from "./upsert-profile-work.input";
import { type UpsertProfileWorkOutput } from "./upsert-profile-work.output";
import { type ProjectExperience } from "../../entities/project-experience/project-experience.entity";
import { type FileStorageRepositoryPort } from "../../ports/file-storage-repository.port";
import { type ProjectLink } from "../../entities/project-link/project-link.entity";

export type UpsertProfileWorkUseCasePort = UseCase<UpsertProfileWorkInput, UpsertProfileWorkOutput>;

export class UpsertProfileWorkUseCase implements UpsertProfileWorkUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      fileStorageRepository: FileStorageRepositoryPort;
      authId: string;
    }
  ) {}

  async execute(input: UpsertProfileWorkInput): Promise<UpsertProfileWorkOutput> {
    return this.deps.uow.runInTransaction<UpsertProfileWorkOutput>(async (uow) => {
      let profile = await uow.profile.findByAuthId(this.deps.authId);
      if (!profile) {
        profile = await uow.profile.create({ authId: this.deps.authId });
      }

      const profileId = profile.fields.id!;

      const projectExperiences = await uow.projectExperience.findByProfileId(profileId);
      const projectIds = projectExperiences.map((projectExperience) => projectExperience.fields.id!);

      const [projectLinks, projectExperienceAttachments] = await Promise.all([
        uow.projectLink.findManyByProjectIds(projectIds),
        uow.projectExperienceAttachment.findManyByProjectIds(projectIds)
      ]);

      const exstingAttachments = await uow.attachment.findManyByIds(
        projectExperienceAttachments.map((project) => project.fields.attachmentId!)
      );

      const exstingAttachmentsMap = new Map(
        exstingAttachments.map((attachment) => [attachment.fields.id!, attachment])
      );

      const now = new Date();

      const existingProjectExperiencesMap = new Map<string, ProjectExperience>();
      const existingProjectLinksMap = new Map<string, ProjectLink>();

      const keptIds = new Set<string>();
      const projectExperiencesSaved: UpsertProfileWorkOutput["projectExperiences"] = [];

      for (const projectExperience of projectExperiences) {
        if (!existingProjectExperiencesMap.has(projectExperience.fields.id!)) {
          existingProjectExperiencesMap.set(projectExperience.fields.id!, projectExperience);
        }

        for (const projectLink of projectLinks) {
          if (!existingProjectLinksMap.has(projectLink.fields.id!)) {
            existingProjectLinksMap.set(projectLink.fields.id!, projectLink);
          }
        }
      }

      for (const [index, inputItem] of input.projectExperiences.entries()) {
        let projectExperienceOutputItem: UpsertProfileWorkOutput["projectExperiences"][number];
        const projectLinksOutput: UpsertProfileWorkOutput["projectExperiences"][number]["links"] = [];
        const projectAttachmentOutput: UpsertProfileWorkOutput["projectExperiences"][number]["attachments"] =
          [];

        const projectExperienceExistingItem = inputItem?.id
          ? existingProjectExperiencesMap.get(inputItem.id)
          : undefined;

        const projectExperienceSaved = await uow.projectExperience.upsert({
          id: inputItem?.id,
          profileId,
          title: inputItem?.title ?? projectExperienceExistingItem?.fields.title,
          isInProgress: inputItem?.isInProgress ?? projectExperienceExistingItem?.fields.isInProgress,
          startDate: inputItem?.startDate ?? projectExperienceExistingItem?.fields.startDate,
          endDate: inputItem?.endDate ?? projectExperienceExistingItem?.fields.endDate,
          description: inputItem?.description ?? projectExperienceExistingItem?.fields.description,
          tags: inputItem?.tags ?? projectExperienceExistingItem?.fields.tags,
          displayOrder:
            inputItem?.displayOrder ?? projectExperienceExistingItem?.fields.displayOrder ?? index + 1,
          updatedAt: now
        });

        projectExperienceOutputItem = {
          ...projectExperienceSaved.toJSON(),
          links: projectLinksOutput,
          attachments: projectAttachmentOutput
        };

        const projectId = projectExperienceSaved.fields.id!;

        for (const projectLinkInputItem of inputItem?.links || []) {
          const projectLinkExistingItem = projectLinkInputItem?.id
            ? existingProjectLinksMap.get(projectLinkInputItem?.id)
            : undefined;

          const projectLinkSaved = await uow.projectLink.upsert({
            id: projectLinkInputItem?.id,
            projectId,
            name: projectLinkInputItem?.name ?? projectLinkExistingItem?.fields?.name,
            url: projectLinkInputItem?.url ?? projectLinkExistingItem?.fields?.url,
            updatedAt: now
          });

          keptIds.add(projectLinkSaved.fields.id!);
          projectLinksOutput.push(projectLinkSaved.fields);
        }

        for (const attachmentInputItem of inputItem?.attachments || []) {
          const hasId = !!attachmentInputItem?.id;
          const hasContent = !!attachmentInputItem?.content;

          // Case 1: create new
          if (!hasId) {
            const attachmentFileStorageCreated = await this.deps.fileStorageRepository.upsertFile({
              file: {
                path: attachmentInputItem?.name!,
                content: attachmentInputItem?.content!
              }
            });

            if (attachmentFileStorageCreated.success) {
              const attachmentCreated = await uow.attachment.create({
                name: attachmentFileStorageCreated.data.file?.name,
                sha: attachmentFileStorageCreated.data.file?.sha,
                storedPath: attachmentFileStorageCreated.data.file?.path,
                streamUrl: attachmentFileStorageCreated.data.file?.url,
                size: attachmentFileStorageCreated.data.file?.size
              });

              await uow.projectExperienceAttachment.create({
                attachmentId: attachmentCreated.fields.id,
                projectId
              });

              keptIds.add(attachmentCreated.fields.id!);
              projectAttachmentOutput.push(attachmentCreated.fields);
            } else {
              throw attachmentFileStorageCreated.error;
            }
          } else {
            // Case 2: reference existing
            if (hasId && !hasContent) {
              keptIds.add(attachmentInputItem?.id!);
              projectAttachmentOutput.push(exstingAttachmentsMap.get(attachmentInputItem?.id!)?.fields!);
              continue;
            }

            // Case 3: replace existing
            const existingAttachment = await uow.attachment.findById(attachmentInputItem.id!);
            if (!existingAttachment) continue;

            const attachmentFileStorageUpdated = await this.deps.fileStorageRepository.upsertFile({
              file: {
                path: existingAttachment.fields.name!,
                content: attachmentInputItem.content!
              },
              sha: existingAttachment.fields.sha!
            });

            if (attachmentFileStorageUpdated.success) {
              const attachmentUpdated = await uow.attachment.updateById(attachmentInputItem.id!, {
                name: attachmentFileStorageUpdated.data.file?.name,
                sha: attachmentFileStorageUpdated.data.file?.sha,
                storedPath: attachmentFileStorageUpdated.data.file?.path,
                streamUrl: attachmentFileStorageUpdated.data.file?.url,
                size: attachmentFileStorageUpdated.data.file?.size
              });

              keptIds.add(attachmentUpdated.fields.id!);
              projectAttachmentOutput.push(attachmentUpdated.fields);
            }
          }
        }

        keptIds.add(projectId);
        projectExperiencesSaved.push(projectExperienceOutputItem);
      }

      const softDeleteProjectIds = Array.from(
        existingProjectExperiencesMap
          .values()
          .filter((item) => item.fields.id && !keptIds.has(item.fields.id))
          .map((item) => item.fields.id!)
      );

      const softDeleteAttachmentIds = projectExperienceAttachments
        .filter(
          (projectExperienceAttachment) =>
            projectExperienceAttachment.fields.attachmentId &&
            !keptIds.has(projectExperienceAttachment.fields.attachmentId)
        )
        .map((item) => item.fields.attachmentId!);

      const attachmentsToDelete = await uow.attachment.findManyByIds(softDeleteAttachmentIds);
      await Promise.all(
        attachmentsToDelete.map((attachment) =>
          this.deps.fileStorageRepository.deleteFile({
            file: { path: attachment.fields.name! },
            sha: attachment.fields.sha!
          })
        )
      );

      await Promise.all([
        uow.projectExperience.softDeleteByIds(softDeleteProjectIds),
        uow.projectLink.softDeleteByProjectIds(softDeleteProjectIds),
        uow.projectExperienceAttachment.softDeleteByAttachmentIds(softDeleteAttachmentIds),
        uow.attachment.softDeleteByIds(softDeleteAttachmentIds)
      ]);

      return {
        projectExperiences: projectExperiencesSaved
      };
    });
  }
}
