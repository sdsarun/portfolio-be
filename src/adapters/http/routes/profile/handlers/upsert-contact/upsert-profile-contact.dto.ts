import z from "zod";

const contactSchema = z.object({
  id: z.uuid().optional(),
  type: z.union([z.string().min(1, "Contact type is required"), z.null()]).optional(),
  value: z.union([z.string().min(1, "Contact value is required"), z.null()]).optional(),
  label: z.string().optional().nullable(),
  displayValue: z.string().optional().nullable(),
  displayOrder: z.number().int().positive().optional().nullable()
});

export const upsertProfileContactBodyDTOSchema = z.object({
  contacts: z.array(contactSchema).optional()
});

export type UpsertProfileContactBodyDTO = z.infer<typeof upsertProfileContactBodyDTOSchema>;
