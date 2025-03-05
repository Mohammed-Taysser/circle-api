import CrudService from '../core/CRUD';
import schema from '../schema/group.schema';

class GroupController extends CrudService<Group> {
  constructor() {
    super(schema, { simpleFields: ['name'] });
  }
}

export default new GroupController();
