import z from "zod";

export const getApiKeysInputDTOSchema = z.object({
  offset: z.coerce
    .number("offset must be an integer")
    .min(0, "offset must be greater than or equal to 0"),
  limit: z.coerce
    .number("limit must be an integer")
    .min(1, "limit must be at least 1")
    .max(100, "limit must be less than or equal to 100")
});

export type GetApiKeysDTO = z.infer<typeof getApiKeysInputDTOSchema>;
