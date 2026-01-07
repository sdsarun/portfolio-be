import z from "zod";

const optionalString = (message: string) => z.union([z.string().min(1, message), z.null()]).optional();

export const upsertProfileInfoBodyDTOSchema = z.object({
  displayName: optionalString("Display name is required"),
  roleName: optionalString("Role name is required"),
  bioTitle: optionalString("Bio title is required"),
  bioDescription: optionalString("Bio description is required"),
  siteUrl: z.union([z.url({ message: "Site URL must be a valid URL" }), z.null()]).optional()
});

export type UpsertProfileInfoBodyDTO = z.infer<typeof upsertProfileInfoBodyDTOSchema>;
