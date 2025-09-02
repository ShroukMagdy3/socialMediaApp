import z from "zod";
export const signUpSchema = {
  body: z
    .object({
      name: z.string().min(2).max(10),
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      email: z.string().email(),
      cPassword: z.string(),
    })
    .required()
    .superRefine((data, context) => {
      if (data.password !== data.cPassword) {
        context.addIssue({
          code: "custom",
          path: ["cPassword"],
        });
      }
    }),
};
