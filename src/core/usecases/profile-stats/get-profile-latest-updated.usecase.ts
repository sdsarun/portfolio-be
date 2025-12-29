import { type UnitOfWork } from "../../ports/unit-of-work.port";
import { type UseCase } from "../base/base.usecase";
import { type GetProfileLatestUpdatedOutput } from "./get-profile-latest-updated.output";

export type GetProfileLatestUpdatedInput = {
  groups?: ("info" | "resume" | "work" | "contact" | "all")[];
};

export type GetProfileLatestUpdatedUseCasePort = UseCase<
  GetProfileLatestUpdatedInput,
  GetProfileLatestUpdatedOutput
>;

export class GetProfileLatestUpdatedUseCase implements GetProfileLatestUpdatedUseCasePort {
  constructor(
    private readonly deps: {
      uow: UnitOfWork;
      authId: string;
    }
  ) {}

  async execute(input: GetProfileLatestUpdatedInput = {}): Promise<GetProfileLatestUpdatedOutput> {
    const groups = input.groups;
    const includeAll = !groups || groups.includes("all");
    const needInfo = includeAll || groups.includes("info");
    const needResume = includeAll || groups.includes("resume");
    const needWork = includeAll || groups.includes("work") || needResume;
    const needContact = includeAll || groups.includes("contact");

    const profile = await this.deps.uow.profile.findByAuthId(this.deps.authId);
    const profileId = profile?.fields.id ?? null;

    const result: GetProfileLatestUpdatedOutput = {
      info: null,
      resume: null,
      work: null,
      contact: null
    };

    if (!profileId) {
      return includeAll ? result : this.filterResult(result, groups);
    }

    const profileUpdatedAt = profile?.fields.updatedAt ?? null;

    let workPromise:
      | Promise<Awaited<ReturnType<UnitOfWork["workExperience"]["findByProfileId"]>>>
      | null = null;
    let skillPromise: Promise<Awaited<ReturnType<UnitOfWork["skill"]["findByProfileId"]>>> | null =
      null;
    let educationPromise:
      | Promise<Awaited<ReturnType<UnitOfWork["education"]["findByProfileId"]>>>
      | null = null;
    let certificationPromise:
      | Promise<Awaited<ReturnType<UnitOfWork["certification"]["findByProfileId"]>>>
      | null = null;
    let contactPromise:
      | Promise<Awaited<ReturnType<UnitOfWork["contact"]["findByProfileId"]>>>
      | null = null;

    const getWork = () =>
      (workPromise ??= this.deps.uow.workExperience.findByProfileId(profileId));
    const getSkills = () => (skillPromise ??= this.deps.uow.skill.findByProfileId(profileId));
    const getEducation = () =>
      (educationPromise ??= this.deps.uow.education.findByProfileId(profileId));
    const getCertifications = () =>
      (certificationPromise ??= this.deps.uow.certification.findByProfileId(profileId));
    const getContacts = () => (contactPromise ??= this.deps.uow.contact.findByProfileId(profileId));

    if (needInfo) {
      result.info = this.maxDate([profileUpdatedAt]);
    }

    if (needResume) {
      const [skills, education, certifications, workExperiences] = await Promise.all([
        getSkills(),
        getEducation(),
        getCertifications(),
        getWork()
      ]);
      result.resume = this.maxDate([
        profileUpdatedAt,
        ...skills.map((item) => item.fields.updatedAt),
        ...education.map((item) => item.fields.updatedAt),
        ...certifications.map((item) => item.fields.updatedAt),
        ...workExperiences.map((item) => item.fields.updatedAt)
      ]);
    }

    if (needWork) {
      const workExperiences = await getWork();
      result.work = this.maxDate(workExperiences.map((item) => item.fields.updatedAt));
    }

    if (needContact) {
      const contacts = await getContacts();
      result.contact = this.maxDate(contacts.map((item) => item.fields.updatedAt));
    }

    if (includeAll) {
      return result;
    }

    return this.filterResult(result, groups);
  }

  private maxDate(dates: (Date | null | undefined)[]): Date | null {
    const timestamps = dates
      .filter((d): d is Date => d instanceof Date)
      .map((d) => d.getTime())
      .filter((t) => !Number.isNaN(t));
    if (timestamps.length === 0) return null;
    return new Date(Math.max(...timestamps));
  }

  private filterResult(
    result: GetProfileLatestUpdatedOutput,
    groups?: GetProfileLatestUpdatedInput["groups"]
  ): GetProfileLatestUpdatedOutput {
    if (!groups) return result;
    return Object.fromEntries(
      Object.entries(result).filter(([key]) => groups.includes(key as keyof typeof result))
    ) as GetProfileLatestUpdatedOutput;
  }
}
