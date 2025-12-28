import z from "zod";

const groupsEnum = z.enum(["info", "resume", "work", "contact", "all"]);

export const getProfileLatestStatsQuerySchema = z.object({
  group: z
    .preprocess((val) => {
      if (val === undefined) return undefined;
      return Array.isArray(val) ? val : [val];
    }, z.array(groupsEnum))
    .optional()
});

export type GetProfileLatestStatsQuery = z.infer<typeof getProfileLatestStatsQuerySchema>;
