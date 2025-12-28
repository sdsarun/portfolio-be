import z from "zod";

export const signInInputDTOSchema = z.object({
  password: z.string().min(1, "Password is required")
});

export type SignInInputDTO = z.infer<typeof signInInputDTOSchema>;
