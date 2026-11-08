import { z } from "zod";

export const submissionSchema = z.object({
  slug: z.string().min(1).max(60),
  values: z.record(
    z.string(),
    z.union([z.string().max(4000), z.array(z.string().max(200)).max(20)]),
  ),
  photos: z.array(z.string().max(120)).max(6),
  photoCount: z.number().int().min(0).max(6),
  consent: z.boolean(),
  website: z.string().max(200),
  startedAt: z.number(),
});

export type Submission = z.infer<typeof submissionSchema>;
