import { z } from 'zod';
import schema from '../schema/user.schema';

// Async refinement to check for existing email
const emailExists = async (email: string | undefined) => {
  if (!email) return true; // Skip validation if email is undefined
  const user = await schema.findOne({ email });
  if (user) {
    throw new Error('Email already in use');
  }
};

// Async refinement to check for existing username
const usernameExists = async (username: string | undefined) => {
  if (!username) return true; // Skip validation if username is undefined
  const user = await schema.findOne({ username });
  if (user) {
    throw new Error('Username already in use');
  }
};

// Schema for updating user
export const updateUserSchema = z.object({
  password: z
    .string()
    .min(8, 'Minimum 8 characters required!')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Please provide a strong password!'
    )
    .optional(),

  firstName: z.string().trim().min(1, 'First name cannot be empty!').optional(),

  lastName: z.string().trim().min(1, 'Last name cannot be empty!').optional(),

  role: z
    .enum(['user', 'admin'], { message: 'Role must be user or admin' })
    .optional(),

  email: z
    .string()
    .trim()
    .email('Invalid email address!')
    .optional()
    .refine(emailExists, { message: 'Email already in use' }),

  username: z
    .string()
    .trim()
    .min(8, 'Minimum 8 characters required!')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please provide a valid username!')
    .optional()
    .refine(usernameExists, { message: 'Username already in use' }),
});

// Schema for resetting password
export const resetPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address!'),
});

export default {
  updateUser: updateUserSchema,
  resetPassword: resetPasswordSchema,
};
