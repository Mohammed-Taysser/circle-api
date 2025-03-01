import { IGroup } from 'types/group';
import CrudService from '../core/CRUD';
import schema from '../schema/group.schema';

class GroupController extends CrudService<IGroup> {
  constructor() {
    super(schema, { simpleFields: ['name'] });
  }
}

export default new GroupController();
