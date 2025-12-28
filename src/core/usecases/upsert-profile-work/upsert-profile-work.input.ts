export type UpsertProfileWorkInput = {
  workExperiences?: {
    id?: string;
    jobTitle?: string | null;
    companyName?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    isCurrent?: boolean | null;
    description?: string | null;
    displayOrder?: number | null;
  }[];
};
