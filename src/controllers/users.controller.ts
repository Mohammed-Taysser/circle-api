import CrudService from '../core/CRUD';
import schema from '../schema/user.schema';

class UserController extends CrudService<User> {
  constructor() {
    super(schema);
  }
}

export default new UserController();
