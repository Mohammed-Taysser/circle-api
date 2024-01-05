import { FilterQuery } from 'mongoose';
import { Group, GroupSaveBody, GroupUpdateBody } from 'types/group';
import schema from '../schema/group.schema';

function countDocuments(filters?: FilterQuery<Group>) {
  return schema.countDocuments(filters);
}

function all() {
  return schema.find().populate('badges');
}

function getById(id: string) {
  return schema.findById(id).populate('badges');
}

function save(body: GroupSaveBody) {
  return new schema(body).save().then((item) => item.toObject());
}

function deleteItem(id: string) {
  return schema.findByIdAndDelete(id).populate('badges');
}

function update(id: string, body: GroupUpdateBody) {
  return schema.findByIdAndUpdate(id, body, { new: true }).populate('badges');
}

function filter(filters: FilterQuery<Group>) {
  return schema.find(filters).populate('badges');
}

const service = {
  all,
  countDocuments,
  getById,
  save,
  delete: deleteItem,
  update,
  filter,
};

export default service;
