import z from 'zod';
import { schema } from './global.validation';

// Base schema for event validation
const eventBaseSchema = z.object({
  title: z.string().min(3, 'Title should be at least 3 characters!'),
  body: z.string().optional(),
  startDate: schema.datetime,
  endDate: schema.datetime,
  allDay: z.boolean().optional(),
  user: schema.objectId,
  attendees: z.array(schema.objectId).optional(),
  location: schema.locationPoint,
  formattedAddress: z.string().optional(),
  type: z.enum(['event', 'birthday', 'anniversary', 'other']).optional(),
  color: z.string().optional(),
  rate: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
    .optional(),
  rateCount: z.number().optional(),
});

// Create Schema (all fields required)
const createEventSchema = z.object({ body: eventBaseSchema });

// Update Schema (all fields optional)
const updateEventSchema = z.object({ body: eventBaseSchema.partial() });

export default {
  create: createEventSchema,
  update: updateEventSchema,
};
