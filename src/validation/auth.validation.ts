import z from 'zod';
import schema from '../schema/user.schema';

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email cannot be empty!' })
      .email({ message: 'Invalid email address!' }),
    password: z.string().min(1, { message: 'Password cannot be empty!' }),
  }),
});

const registerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1, 'First name cannot be empty!'),
    lastName: z.string().trim().min(1, 'Last name cannot be empty!'),
    email: z
      .string()
      .trim()
      .min(1, 'Email cannot be empty!')
      .email('Invalid email address!')
      .refine(async (email) => {
        const user = await schema.findOne({ email });
        return !user;
      }, 'Email already in use'),
    username: z
      .string()
      .trim()
      .min(8, 'Minimum 8 characters required!')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please provide a valid username!')
      .refine(async (username) => {
        const user = await schema.findOne({ username });
        return !user;
      }, 'Username already in use'),
    password: z
      .string()
      .trim()
      .min(8, 'Minimum 8 characters required!')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Please provide a strong password!'
      ),
  }),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email cannot be empty!')
    .email('Invalid email address!')
    .refine(
      async (email) => {
        const user = await schema.findOne({ email });
        return !!user; // Return true if the user exists, false otherwise
      },
      { message: 'Email does not exist' }
    ),
});

export default {
  login: loginSchema,
  register: registerSchema,
  forgotPassword: forgotPasswordSchema,
};
