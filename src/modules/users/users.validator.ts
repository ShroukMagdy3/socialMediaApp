import z from "zod";


export const signInSchema = {
  body: z
    .strictObject({
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      email: z.string().email(),
    })
    .required(),
};

export const signUpSchema = {
  body: signInSchema.body.extend({
      userName: z.string().min(2).max(10),
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      email: z.string().email(),
      cPassword: z.string(),
      age: z.number(),
      address: z.string(),
      phone: z.string(),
      gender: z.string(),
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
export const confirmEmailSchema = {
  body: z
    .object({
      email: z.string().email(),
      otp: z.string().regex(/^\d{6}$/),
    })
    .required(),
};

export type signUpSchemaType = z.infer<typeof signUpSchema.body>;
export type signInSchemaType = z.infer<typeof signInSchema.body>;
export type confirmEmailSchemaType = z.infer<typeof confirmEmailSchema.body>;
