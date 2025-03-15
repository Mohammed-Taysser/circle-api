import z from 'zod';

// Base schema for badge validation
const badgeBaseSchema = z.object({
  body: z.string().min(1, 'Body is required'),
  label: z.string().min(1, 'Label is required'),
});

// Create Schema (all fields required)
const createBadgeSchema = z.object({ body: badgeBaseSchema });

// Update Schema (all fields optional)
const updateBadgeSchema = z.object({ body: badgeBaseSchema.partial() });

export default {
  create: createBadgeSchema,
  update: updateBadgeSchema,
};
