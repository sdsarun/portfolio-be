import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileWorkOutput } from "./get-profile-work.output";

export type GetProfileWorkUseCasePort = UseCase<void, GetProfileWorkOutput>;

export class GetProfileWorkUseCase implements GetProfileWorkUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(): Promise<GetProfileWorkOutput> {
    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    if (!profile?.fields.id) {
      return { projectExperiences: [] };
    }

    const profileId = profile.fields.id;
    const projectExperiences = await this.deps.uow.projectExperience.findByProfileId(profileId);
    const projectIds = projectExperiences.map((item) => item.fields.id!).filter(Boolean);
    const [projectLinks, projectExperienceAttachments] = await Promise.all([
      this.deps.uow.projectLink.findManyByProjectIds(projectIds),
      this.deps.uow.projectExperienceAttachment.findManyByProjectIds(projectIds)
    ]);

    const attachmentIds = projectExperienceAttachments
      .map((item) => item.fields.attachmentId)
      .filter((id): id is string => Boolean(id));

    const attachments = await this.deps.uow.attachment.findManyByIds(attachmentIds);
    const attachmentById = new Map(attachments.map((item) => [item.fields.id!, item.fields]));

    return {
      projectExperiences: projectExperiences.map((projectExperience) => {
        const projectId = projectExperience.fields.id;
        const links = projectLinks
          .filter((link) => link.fields.projectId === projectId)
          .map((link) => link.fields);
        const mappedAttachments = projectExperienceAttachments
          .filter((item) => item.fields.projectId === projectId)
          .map((item) => attachmentById.get(item.fields.attachmentId!))
          .filter((item): item is NonNullable<typeof item> => Boolean(item));

        return {
          ...projectExperience.fields,
          links,
          attachments: mappedAttachments
        };
      })
    };
  }
}
