import z from 'zod';
import { schema } from './global.validation';

// Base Schema (common fields)
const groupBaseSchema = z.object({
  visibility: z.enum(['public', 'private', 'friends'], {
    required_error: 'Visibility is required!',
  }),
  name: z.string().min(2, 'Name too short!').trim(),
  avatar: z.string().trim().optional(),
  cover: z.string().trim().optional(),
  badges: z
    .array(
      z.object({
        badge: schema.objectId,
        earnAt: schema.datetime.optional(),
      })
    )
    .optional(),
});

// Create Schema (requires all fields)
const createGroupSchema = z.object({ body: groupBaseSchema });

// Update Schema (all fields optional for partial updates)
const updateGroupSchema = z.object({
  body: groupBaseSchema.partial(),
});

export default {
  create: createGroupSchema,
  update: updateGroupSchema,
};
