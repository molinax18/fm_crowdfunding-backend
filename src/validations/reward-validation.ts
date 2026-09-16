import z from "zod";

export const reward = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(3, { error: "Title be at least 3 characters long" })
    .max(100, { error: "Title cannot exceed 100 characters" }),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(3, { error: "Description be at least 3 characters long" })
    .max(255, { error: "Description cannot exceed 255 characters" }),
  min_pledge: z
    .number({ error: "Minimum pledge is required" })
    .min(0, { error: "Minimum pledge cannot be negative" }),
  remaining: z
    .number({ error: "Remaining rewards are required" })
    .min(0, { error: "Remaining rewards cannot be negative" }),
});

export type TRewardInput = z.infer<typeof reward>;
const compiledReward = z.compile(reward);
const partialReward = z
  .deepPartial(reward)
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field is required",
  });

const compiledPartialReward = z.compile(partialReward);

export function validateReward(data: TRewardInput) {
  return compiledReward.safeParse(data);
}

export function validatePartialReward(data: Partial<TRewardInput>) {
  return compiledPartialReward.safeParse(data);
}
