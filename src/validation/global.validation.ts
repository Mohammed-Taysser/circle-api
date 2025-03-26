import mongoose from 'mongoose';
import z from 'zod';

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId!',
  });

const locationPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z
    .array(z.number())
    .length(2, 'Coordinates must contain exactly [longitude, latitude]!'),
});

const dateTimeSchema = z.string().datetime({ local: true, offset: true });

const schema = {
  objectId: objectIdSchema,
  locationPoint: locationPointSchema,
  datetime: dateTimeSchema,
};

export { schema };
