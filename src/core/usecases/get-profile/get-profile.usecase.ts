import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileOutput } from "./get-profile.output";
import { groupEntityByField } from "../../utils/collection/group-entity-by-field";

export type GetProfileUseCasePort = UseCase<void, GetProfileOutput>;

export class GetProfileUseCase implements GetProfileUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(): Promise<GetProfileOutput> {
    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    if (!profile?.fields.id) {
      return {
        profile: profile?.fields ?? null,
        workExperiences: [],
        projectExperiences: [],
        skills: [],
        education: [],
        certification: [],
        contacts: []
      };
    }

    const profileId = profile.fields.id;

    const [workExperiences, projects, skills, education, certification, contact] = await Promise.all([
      this.deps.uow.workExperience.findByProfileId(profileId),
      this.deps.uow.projectExperience.findByProfileId(profileId),
      this.deps.uow.skill.findByProfileId(profileId),
      this.deps.uow.education.findByProfileId(profileId),
      this.deps.uow.certification.findByProfileId(profileId),
      this.deps.uow.contact.findByProfileId(profileId)
    ]);

    const projectIds = projects.map((project) => project.fields.id!);

    const [projectLinks, projectAttachments] = await Promise.all([
      this.deps.uow.projectLink.findManyByProjectIds(projectIds),
      this.deps.uow.projectExperienceAttachment.findManyByProjectIds(projectIds)
    ]);

    const attachments = await this.deps.uow.attachment.findManyByIds(
      projectAttachments.map((projectAttachment) => projectAttachment.fields.attachmentId!)
    );

    const projectAttachmentsMap = groupEntityByField(projectAttachments, (field) => field.projectId);
    const projectLinksMap = groupEntityByField(projectLinks, (field) => field.projectId);
    const attachmentsMap = groupEntityByField(attachments, (field) => field.id);

    return {
      profile: profile.fields,
      workExperiences: workExperiences.map((item) => item.fields),
      projectExperiences: projects.map((item) => {
        const projectId = item.fields.id!;
        return {
          ...item.fields,
          links: projectLinksMap.get(projectId)?.map((projectLink) => projectLink.fields) || [],
          attachments:
            projectAttachmentsMap
              .get(projectId)
              ?.flatMap((projectAttachment) =>
                attachmentsMap.get(projectAttachment.fields.attachmentId!)
              )
              ?.map((attachment) => attachment?.fields!) || []
        };
      }),
      skills: skills.map((item) => item.fields),
      education: education.map((item) => item.fields),
      certification: certification.map((item) => item.fields),
      contacts: contact.map((item) => item.fields)
    };
  }
}
