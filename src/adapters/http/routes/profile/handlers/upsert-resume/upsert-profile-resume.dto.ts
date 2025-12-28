import z from "zod";

export const upsertProfileResumeInputDTOSchema = z.object({
  resumeUrl: z.union([z.url({ message: "Resume URL must be a valid URL" }), z.null()]).optional()
});

export type UpsertProfileResumeDTO = z.infer<typeof upsertProfileResumeInputDTOSchema>;
