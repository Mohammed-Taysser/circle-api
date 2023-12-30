import { FilterQuery } from 'mongoose';
import { Badge, BadgeSaveBody, BadgeUpdateBody } from 'types/badge';
import schema from '../schema/badge.schema';

function countDocuments(filters?: FilterQuery<Badge>) {
  return schema.countDocuments(filters);
}

function all() {
  return schema.find();
}

function getById(id: string) {
  return schema.findById(id);
}

function save(body: BadgeSaveBody) {
  return new schema(body).save().then((badge) => badge.toObject());
}

function deleteBadge(id: string) {
  return schema.findByIdAndDelete(id);
}

function update(id: string, body: BadgeUpdateBody) {
  return schema.findByIdAndUpdate(id, body, { new: true });
}

function filter(filters: FilterQuery<Badge>) {
  return schema.find(filters);
}

const service = {
  all,
  countDocuments,
  getById,
  save,
  delete: deleteBadge,
  update,
  filter,
};

export default service;
