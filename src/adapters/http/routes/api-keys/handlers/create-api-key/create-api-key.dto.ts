import z from "zod";

export const createApiKeyBodyDTOSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name must be at most 100 characters.")
});

export type CreateApiKeyBodyDTO = z.infer<typeof createApiKeyBodyDTOSchema>;
