import { FilterQuery } from 'mongoose';
import { User, UserSaveBody, UserUpdateBody } from 'types/user';
import schema from '../schema/user.schema';

function countDocuments(filters?: FilterQuery<User>) {
  return schema.countDocuments(filters);
}

function all() {
  return schema.find().populate('badges.badge').populate('bookmarks.bookmark');
}

function filter(filters: FilterQuery<User>) {
  return schema
    .find(filters)
    .populate('badges.badge')
    .populate('bookmarks.bookmark');
}

function getByEmail(email: string) {
  return schema
    .findOne({ email })
    .populate('badges.badge')
    .populate('bookmarks.bookmark');
}

function getByUsername(username: string) {
  return schema
    .findOne({ username })
    .populate('badges.badge')
    .populate('bookmarks.bookmark');
}

function getById(id: string) {
  return schema
    .findById(id)
    .populate('badges.badge')
    .populate('bookmarks.bookmark');
}

function save(body: UserSaveBody) {
  return new schema(body).save().then((item) => item.toObject());
}

function deleteItem(id: string) {
  return schema
    .findByIdAndDelete(id)
    .populate('badges.badge')
    .populate('bookmarks.bookmark');
}

function update(id: string, body: UserUpdateBody) {
  return schema
    .findByIdAndUpdate(id, body, { new: true })
    .populate('badges.badge')
    .populate('bookmarks.bookmark');
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
