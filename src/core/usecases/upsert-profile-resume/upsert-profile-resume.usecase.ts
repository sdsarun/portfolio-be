import { Certification } from "../../entities/certifications/certifications.entity";
import { Education } from "../../entities/education/education.entity";
import { Skill } from "../../entities/skill/skill.entity";
import { WorkExperience } from "../../entities/work-experience/work-experience.entity";
import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type UpsertProfileResumeInput } from "./upsert-profile-resume.input";
import { type UpsertProfileResumeOutput } from "./upsert-profile-resume.output";

export type UpsertProfileResumeUseCasePort = UseCase<
  UpsertProfileResumeInput,
  UpsertProfileResumeOutput
>;

export class UpsertProfileResumeUseCase implements UpsertProfileResumeUseCasePort {
  constructor(private readonly deps: { uow: UnitOfWork; authId: string }) {}

  async execute(input: UpsertProfileResumeInput): Promise<UpsertProfileResumeOutput> {
    return this.deps.uow.runInTransaction(async (uow) => {
      let profile = await uow.profile.findByAuthId(this.deps.authId);
      if (!profile) {
        profile = await uow.profile.create({ authId: this.deps.authId });
      }

      const now = new Date();

      const profileId = profile.fields.id!;
      const profileToReturn =
        input.resumeUrl === undefined
          ? profile
          : await this.deps.uow.profile.updateById(profileId, {
              resumeUrl: input.resumeUrl,
              updatedAt: now
            });

      const [workExperiences, skills, education, certification] = await Promise.all([
        uow.workExperience.findByProfileId(profileId),
        uow.skill.findByProfileId(profileId),
        uow.education.findByProfileId(profileId),
        uow.certification.findByProfileId(profileId)
      ]);

      const isRequestUpdateWorkExperience = typeof input?.workExperiences !== "undefined";
      const isRequestUpdateSkills = typeof input?.skills !== "undefined";
      const isRequestUpdateEducation = typeof input?.education !== "undefined";
      const isRequestUpdateCertification = typeof input?.certification !== "undefined";

      const keptIds = new Set<string>();

      const workExperiencesSaved: WorkExperience[] = [];
      const skillsSaved: Skill[] = [];
      const educationSaved: Education[] = [];
      const certificationSaved: Certification[] = [];

      for (const [index, inputItem] of input.workExperiences?.entries() || []) {
        const existingItem = workExperiences.find((existingItem) => {
          return existingItem.fields.id === inputItem?.id;
        });

        const saved = await uow.workExperience.upsert({
          id: inputItem?.id,
          profileId,
          jobTitle: inputItem?.jobTitle ?? existingItem?.fields.jobTitle,
          description: inputItem?.description ?? existingItem?.fields.description,
          companyName: inputItem?.companyName ?? existingItem?.fields.companyName,
          startDate: inputItem?.startDate ?? existingItem?.fields.startDate,
          endDate: inputItem?.endDate ?? existingItem?.fields.endDate,
          isCurrent: inputItem?.isCurrent ?? existingItem?.fields.isCurrent,
          displayOrder: inputItem?.displayOrder ?? existingItem?.fields.displayOrder ?? index + 1,
          updatedAt: now
        });

        if (saved.fields.id) {
          keptIds.add(saved.fields.id);
        }
        workExperiencesSaved.push(saved);
      }

      for (const [index, inputItem] of input.skills?.entries() || []) {
        const existingItem = skills.find((existingItem) => existingItem.fields.id === inputItem?.id);

        const saved = await uow.skill.upsert({
          id: inputItem?.id,
          profileId,
          categoryName: inputItem?.categoryName ?? existingItem?.fields.categoryName,
          skillNames: inputItem?.skillNames ?? existingItem?.fields.skillNames,
          displayOrder: inputItem?.displayOrder ?? existingItem?.fields.displayOrder ?? index + 1,
          updatedAt: now
        });

        if (saved.fields.id) {
          keptIds.add(saved.fields.id);
        }
        skillsSaved.push(saved);
      }

      for (const [index, inputItem] of input.education?.entries() || []) {
        const existingItem = education.find((existingItem) => existingItem.fields.id === inputItem?.id);

        const saved = await uow.education.upsert({
          id: inputItem?.id,
          profileId,
          institution: inputItem?.institution ?? existingItem?.fields.institution,
          startDate: inputItem?.startDate ?? existingItem?.fields.startDate,
          displayOrder: inputItem?.displayOrder ?? existingItem?.fields.displayOrder ?? index + 1,
          updatedAt: now
        });

        if (saved.fields.id) {
          keptIds.add(saved.fields.id);
        }
        educationSaved.push(saved);
      }

      for (const [index, inputItem] of input.certification?.entries() || []) {
        const existingItem = certification.find(
          (existingItem) => existingItem.fields.id === inputItem?.id
        );

        const saved = await uow.certification.upsert({
          id: inputItem?.id,
          profileId,
          name: inputItem?.name ?? existingItem?.fields.name,
          issuer: inputItem?.issuer ?? existingItem?.fields.issuer,
          completeDate: inputItem?.completeDate ?? existingItem?.fields.completeDate,
          displayOrder: inputItem?.displayOrder ?? existingItem?.fields.displayOrder ?? index + 1,
          updatedAt: now
        });

        if (saved.fields.id) {
          keptIds.add(saved.fields.id);
        }
        certificationSaved.push(saved);
      }

      const deleteWorkExperience = isRequestUpdateWorkExperience
        ? workExperiences
            .filter((item) => item.fields.id && !keptIds.has(item.fields.id))
            .map((item) => uow.workExperience.deleteById(item.fields.id!))
        : [];

      const deleteSkills = isRequestUpdateSkills
        ? skills
            .filter((item) => item.fields.id && !keptIds.has(item.fields.id))
            .map((item) => uow.skill.deleteById(item.fields.id!))
        : [];

      const deleteEducation = isRequestUpdateEducation
        ? education
            .filter((item) => item.fields.id && !keptIds.has(item.fields.id))
            .map((item) => uow.education.deleteById(item.fields.id!))
        : [];

      const deleteCertification = isRequestUpdateCertification
        ? certification
            .filter((item) => item.fields.id && !keptIds.has(item.fields.id))
            .map((item) => uow.certification.deleteById(item.fields.id!))
        : [];

      await Promise.all([
        ...deleteWorkExperience,
        ...deleteSkills,
        ...deleteEducation,
        ...deleteCertification
      ]);

      const workExperiencesResult = isRequestUpdateWorkExperience
        ? workExperiencesSaved.map((w) => w.fields)
        : workExperiences.map((w) => w.fields);

      const skillsResult = isRequestUpdateSkills
        ? skillsSaved.map((s) => s.fields)
        : skills.map((s) => s.fields);

      const educationResult = isRequestUpdateEducation
        ? educationSaved.map((e) => e.fields)
        : education.map((e) => e.fields);

      const certificationResult = isRequestUpdateCertification
        ? certificationSaved.map((c) => c.fields)
        : certification.map((c) => c.fields);

      return {
        profile: profileToReturn.fields,
        certification: certificationResult,
        education: educationResult,
        skills: skillsResult,
        workExperiences: workExperiencesResult
      };
    });
  }
}
