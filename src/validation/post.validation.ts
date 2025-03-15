import z from 'zod';

const reactionSchema = z.object({
  body: z.object({
    react: z.enum(['wow', 'like', 'love', 'star'], {
      required_error: 'Reaction is required!',
      invalid_type_error: 'Invalid reaction!',
    }),
  }),
});

const assetTypes = [
  'friend',
  'group',
  'cover',
  'avatar',
  'gallery',
  'video',
  'audio',
  'youtube',
] as const;

const postVariants = [
  'cover',
  'avatar',
  'blog',
  'gallery',
  'video',
  'audio',
  'youtube',
  'group',
  'friend',
  'share',
] as const;

const visibilityOptions = ['public', 'friends', 'private'] as const;

const assetSchema = z.object({
  type: z.enum(assetTypes),
  url: z.string().trim().url({
    message: 'Invalid URL!',
  }),
  refId: z.string().optional(), // Only needed for 'friend' and 'group'
  refModel: z.enum(['User', 'Group']).optional(), // Required if `refId` exists
  metadata: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
      duration: z.number().optional(),
      format: z.string().optional(),
      size: z.number().optional(),
    })
    .optional(),
});

// 🔹 Base schema (shared between create and update)
const basePostSchema = z.object({
  variant: z.enum(postVariants),
  visibility: z.enum(visibilityOptions),
  activity: z.string().optional(),
  body: z.string().optional(),
  assets: z.array(assetSchema).optional(),
});

// 🔹 Create Schema (Extends Base, Requires User)
const createPostSchema = basePostSchema.extend({
  user: z.string().min(1, 'User is required'),
});

// 🔹 Update Schema (Partial, since all fields are optional)
const updatePostSchema = basePostSchema.partial();

export default {
  reaction: reactionSchema,
  createPost: createPostSchema,
  updatePost: updatePostSchema,
};
