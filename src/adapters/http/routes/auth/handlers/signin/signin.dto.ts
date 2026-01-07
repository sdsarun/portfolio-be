import z from "zod";

export const signInBodyDTOSchema = z.object({
  password: z.string().min(1, "Password is required")
});

export type SignInBodyDTO = z.infer<typeof signInBodyDTOSchema>;
