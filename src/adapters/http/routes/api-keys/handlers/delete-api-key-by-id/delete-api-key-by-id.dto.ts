import z from "zod";

export const deleteApiKeyByIdParamsDTOSchema = z.object({
  id: z.uuidv4()
});

export type DeleteApiKeyByIdParamsDTO = z.infer<typeof deleteApiKeyByIdParamsDTOSchema>;
