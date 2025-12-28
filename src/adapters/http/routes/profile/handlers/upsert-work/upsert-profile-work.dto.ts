import z from "zod";

const workExperienceSchema = z.object({
  id: z.uuid().optional(),
  jobTitle: z.union([z.string().min(1, "Job title is required"), z.null()]).optional(),
  companyName: z.union([z.string().min(1, "Company name is required"), z.null()]).optional(),
  startDate: z
    .union([z.coerce.date(), z.null()])
    .optional()
    .transform((val) => (val === undefined ? null : val)),
  endDate: z
    .union([z.coerce.date(), z.null()])
    .optional()
    .transform((val) => (val === undefined ? null : val)),
  isCurrent: z.boolean().optional(),
  description: z.string().optional().nullable().transform((val) => (val === undefined ? null : val)),
  displayOrder: z.number().int().positive().optional().nullable()
});

export const upsertProfileWorkInputDTOSchema = z.object({
  workExperiences: z.array(workExperienceSchema).optional()
});

export type UpsertProfileWorkDTO = z.infer<typeof upsertProfileWorkInputDTOSchema>;
