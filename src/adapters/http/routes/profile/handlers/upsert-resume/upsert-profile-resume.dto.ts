import z from "zod";

export const upsertProfileResumeInputDTOSchema = z.object({
  resumeUrl: z.union([z.url({ message: "Resume URL must be a valid URL" }), z.null()]).optional(),
  workExperiences: z
    .array(
      z.object({
        id: z.uuidv4().nullish(),
        jobTitle: z.string().nullish(),
        companyName: z.string().nullish(),
        startDate: z.iso
          .date()
          .transform((val) => (val ? new Date(val) : undefined))
          .nullish(),
        endDate: z.iso
          .date()
          .transform((val) => (val ? new Date(val) : undefined))
          .nullish(),
        isCurrent: z.boolean().nullish(),
        description: z.string().nullish(),
        displayOrder: z.number().nullish()
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        id: z.uuidv4().nullish(),
        categoryName: z.string().nullish(),
        skillNames: z.string().nullish(),
        displayOrder: z.number().nullish()
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        id: z.uuidv4().nullish(),
        major: z.string().nullish(),
        institution: z.string().nullish(),
        startDate: z.iso
          .date()
          .transform((val) => (val ? new Date(val) : undefined))
          .nullish(),
        endDate: z.iso
          .date()
          .transform((val) => (val ? new Date(val) : undefined))
          .nullish(),
        displayOrder: z.number().nullish()
      })
    )
    .optional(),
  certification: z
    .array(
      z.object({
        id: z.uuidv4().nullish(),
        name: z.string().nullish(),
        issuer: z.string().nullish(),
        completeDate: z.iso
          .date()
          .transform((val) => (val ? new Date(val) : undefined))
          .nullish(),
        displayOrder: z.number().nullish()
      })
    )
    .optional()
});

export type UpsertProfileResumeDTO = z.infer<typeof upsertProfileResumeInputDTOSchema>;
