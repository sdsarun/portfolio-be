import z from "zod";

export const revokeApiKeysBodyDTOSchema = z.object({
  ids: z
    .array(z.uuidv4("Each API key ID must be a valid UUID."))
    .min(1, "At least one API key ID must be provided.")
});

export type RevokeApiKeysBodyDTO = z.infer<typeof revokeApiKeysBodyDTOSchema>;
