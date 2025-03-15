import z from 'zod';
import schema from '../schema/subscription.schema';

const subscriptionSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address!' })
    .refine(
      async (email) => {
        const existingSubscription = await schema.findOne({ email });
        return !existingSubscription;
      },
      { message: 'Email already in use' }
    ),
});

const emailSubscriptionVerifySchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address!' }),
});

export default {
  subscription: subscriptionSchema,
  emailSubscriptionVerify: emailSubscriptionVerifySchema,
};
