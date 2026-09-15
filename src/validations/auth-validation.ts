import z from "zod";

const userAuth = z.object({
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

export type TUserAuthInput = z.infer<typeof userAuth>;
const userAuthCompile = z.compile(userAuth);

export function validateAuthUser(data: TUserAuthInput) {
  return userAuthCompile.safeParse(data);
}
