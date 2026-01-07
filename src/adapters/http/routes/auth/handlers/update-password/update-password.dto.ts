import z from "zod";

export const updatePasswordBodyDTOSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(1, "New password is required")
  })
  .superRefine((data, ctx) => {
    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "AUTH_PASSWORD_UNCHANGED",
        path: ["newPassword"]
      });
    }
  });

export type UpdatePasswordBodyDTO = z.infer<typeof updatePasswordBodyDTOSchema>;
