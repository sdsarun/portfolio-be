import z from "zod";

export const upsertProfileWorkBodyDTOSchema = z.object({
  projectExperiences: z.array(
    z.object({
      id: z.uuidv4().nullish(),
      title: z.string().nullish(),
      isInProgress: z.boolean().nullish(),
      startDate: z.iso
        .date()
        .transform((val) => (val ? new Date(val) : undefined))
        .nullish(),
      endDate: z.iso
        .date()
        .transform((val) => (val ? new Date(val) : undefined))
        .nullish(),
      imageUrl: z.union([z.base64(), z.url()]).nullish(),
      description: z.string().nullish(),
      tags: z.string().nullish(),
      displayOrder: z.number().nullish(),
      attachments: z
        .array(
          z
            .object({
              id: z.uuidv4().nullish(),
              name: z.string().nullish(),
              mime: z
                .string()
                .nullish()
                .refine((v) => !v || ["image/jpeg", "image/png"].includes(v), {
                  message: "Only JPEG and PNG are allowed"
                }),
              sha: z.string().nullish(),
              content: z.base64().nullish()
            })
            .superRefine((attachment, ctx) => {
              const hasId = !!attachment?.id;
              const hasContent = !!attachment?.content;
              const hasName = !!attachment?.name;

              // Case 1: reference existing
              if (hasId && !hasContent) {
                return;
              }

              // Case 2: create new
              if (!hasId && hasContent) {
                if (!hasName) {
                  ctx.addIssue({
                    code: "custom",
                    message: "Name is required when content is provided"
                  });
                }
                return;
              }

              // Case 3: replace existing
              if (hasId && hasContent) {
                return;
              }

              ctx.addIssue({
                code: "custom",
                message: "Attachment must be either: reference existing, create new, or replace existing"
              });
            })
        )
        .nullish(),
      links: z
        .array(
          z.object({
            id: z.uuidv4().nullish(),
            name: z.string().nullish(),
            url: z.string().nullish()
          })
        )
        .nullish()
    })
  )
});

export type UpsertProfileWorkBodyDTO = z.infer<typeof upsertProfileWorkBodyDTOSchema>;
