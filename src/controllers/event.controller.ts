import CrudService from '../core/CRUD';
import schema from '../schema/event.schema';

class EventController extends CrudService<UserEvent> {
  constructor() {
    super(schema, { simpleFields: ['title'] });
  }
}

export default new EventController();
