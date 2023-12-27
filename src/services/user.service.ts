import { UserSaveBody, UserUpdateBody } from 'types/user';
import schema from '../schema/user.schema';

const service = {
  all: () => schema.find(),
  getByEmail: (email: string) => schema.findOne({ email }),
  getById: (id: string) => schema.findById(id),
  save: (body: UserSaveBody) =>
    new schema(body).save().then((user) => user.toObject()),
  delete: (id: string) => schema.findByIdAndDelete(id),
  update: (id: string, body: UserUpdateBody) =>
    schema.findByIdAndUpdate(id, body, { new: true }),
};

export default service;
