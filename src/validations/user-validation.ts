import z from "zod";

export const user = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(100, { error: "Name cannot exceed 100 characters" }),
  email: z.email({ error: "Please provide a valid email address" }),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .max(72, { error: "Password cannot exceed 72 characters" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      error: "Password must contain at least one number",
    }),
});

export type TUserInput = z.infer<typeof user>;
const compiledUser = z.compile(user);
const compiledPartialUser = z.compile(z.deepPartial(user));

export function validateUser(data: TUserInput) {
  return compiledUser.safeParse(data);
}

export function validatePartialUser(data: Partial<TUserInput>) {
  return compiledPartialUser.safeParse(data);
}
