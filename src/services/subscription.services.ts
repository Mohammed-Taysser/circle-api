import { FilterQuery } from 'mongoose';
import { Subscription, SubscriptionSaveBody } from 'types/subscription';
import schema from '../schema/subscription.schema';

function countDocuments(filters?: FilterQuery<Subscription>) {
  return schema.countDocuments(filters);
}

function all() {
  return schema.find();
}

function getByEmail(email: string) {
  return schema.findOne({ email });
}

function save(body: SubscriptionSaveBody) {
  return new schema(body).save().then((item) => item.toObject());
}

function deleteItem(id: string) {
  return schema.findByIdAndDelete(id);
}

const service = {
  all,
  countDocuments,
  getByEmail,
  save,
  delete: deleteItem,
};

export default service;
