import mongoose, { FilterQuery } from 'mongoose';
import { User, UserSaveBody, UserUpdateBody } from 'types/user';
import schema from '../schema/user.schema';

function countDocuments(filters?: FilterQuery<User>) {
  return schema.countDocuments(filters);
}

function all() {
  return populate(schema.find());
}

function filter(filters: FilterQuery<User>) {
  return populate(schema.find(filters));
}

function getByEmail(email: string) {
  return populate(schema.findOne({ email }));
}

function getByUsername(username: string) {
  return populate(schema.findOne({ username }));
}

function getById(id: string) {
  return populate(schema.findById(id));
}

function save(body: UserSaveBody) {
  return new schema(body).save().then((item) => item.toObject());
}

function deleteItem(id: string) {
  return populate(schema.findByIdAndDelete(id));
}

function update(id: string, body: UserUpdateBody) {
  return populate(schema.findByIdAndUpdate(id, body, { new: true }));
}

function populate(query: mongoose.Query<any, User>) {
  return query.populate('badges.badge').populate('bookmarks.post');
}

const service = {
  all,
  countDocuments,
  getByEmail,
  getByUsername,
  getById,
  save,
  delete: deleteItem,
  update,
  filter,
};

export default service;
