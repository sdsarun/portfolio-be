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
  constructor(private readonly deps: { uow: UnitOfWork }) {}

  async execute(input: GetProfileLatestUpdatedInput = {}): Promise<GetProfileLatestUpdatedOutput> {
    const groups = input.groups;
    const includeAll = !groups || groups.includes("all");
    const needInfo = includeAll || groups.includes("info");
    const needResume = includeAll || groups.includes("resume");
    const needWork = includeAll || groups.includes("work") || needResume;
    const needContact = includeAll || groups.includes("contact");

    let profilesPromise: Promise<Awaited<ReturnType<UnitOfWork["profile"]["findAll"]>>> | null = null;
    let workPromise: Promise<Awaited<ReturnType<UnitOfWork["workExperience"]["findAll"]>>> | null = null;
    let skillPromise: Promise<Awaited<ReturnType<UnitOfWork["skill"]["findAll"]>>> | null = null;
    let educationPromise: Promise<Awaited<ReturnType<UnitOfWork["education"]["findAll"]>>> | null = null;
    let certificationPromise: Promise<Awaited<ReturnType<UnitOfWork["certification"]["findAll"]>>> | null = null;
    let contactPromise: Promise<Awaited<ReturnType<UnitOfWork["contact"]["findAll"]>>> | null = null;

    const getProfiles = () => (profilesPromise ??= this.deps.uow.profile.findAll());
    const getWork = () => (workPromise ??= this.deps.uow.workExperience.findAll());
    const getSkills = () => (skillPromise ??= this.deps.uow.skill.findAll());
    const getEducation = () => (educationPromise ??= this.deps.uow.education.findAll());
    const getCertifications = () =>
      (certificationPromise ??= this.deps.uow.certification.findAll());
    const getContacts = () => (contactPromise ??= this.deps.uow.contact.findAll());

    const result: GetProfileLatestUpdatedOutput = {
      info: null,
      resume: null,
      work: null,
      contact: null
    };

    if (needInfo) {
      const profiles = await getProfiles();
      result.info = this.maxDate(profiles.map((item) => item.fields.updatedAt));
    }

    if (needResume) {
      const [profiles, skills, education, certifications, workExperiences] = await Promise.all([
        getProfiles(),
        getSkills(),
        getEducation(),
        getCertifications(),
        getWork()
      ]);
      result.resume = this.maxDate([
        ...profiles.map((item) => item.fields.updatedAt),
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

    return Object.fromEntries(
      Object.entries(result).filter(([key]) => groups.includes(key as keyof typeof result))
    ) as GetProfileLatestUpdatedOutput;
  }

  private maxDate(dates: (Date | null | undefined)[]): Date | null {
    const timestamps = dates
      .filter((d): d is Date => d instanceof Date)
      .map((d) => d.getTime())
      .filter((t) => !Number.isNaN(t));
    if (timestamps.length === 0) return null;
    return new Date(Math.max(...timestamps));
  }
}
