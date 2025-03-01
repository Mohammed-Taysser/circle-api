import { IUser } from 'types/user';
import CrudService from '../core/CRUD';
import schema from '../schema/user.schema';

class UserController extends CrudService<IUser> {
  constructor() {
    super(schema);
  }
}

export default new UserController();
