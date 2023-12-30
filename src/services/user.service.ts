import { FilterQuery } from 'mongoose';
import { User, UserSaveBody, UserUpdateBody } from 'types/user';
import schema from '../schema/user.schema';

function countDocuments(filters?: FilterQuery<User>) {
  return schema.countDocuments(filters);
}

function all() {
  return schema.find().populate('badges');
}

function filter(filters: FilterQuery<User>) {
  return schema.find(filters).populate('badges');
}

function getByEmail(email: string) {
  return schema.findOne({ email }).populate('badges');
}

function getByUsername(username: string) {
  return schema.findOne({ username }).populate('badges');
}

function getById(id: string) {
  return schema.findById(id).populate('badges');
}

function save(body: UserSaveBody) {
  return new schema(body).save().then((user) => user.toObject());
}

function deleteUser(id: string) {
  return schema.findByIdAndDelete(id).populate('badges');
}

function update(id: string, body: UserUpdateBody) {
  return schema.findByIdAndUpdate(id, body, { new: true }).populate('badges');
}

const service = {
  all,
  countDocuments,
  getByEmail,
  getByUsername,
  getById,
  save,
  delete: deleteUser,
  update,
  filter,
};

export default service;
