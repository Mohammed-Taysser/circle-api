import CrudService from '../../core/CRUD';
import schema from '../../schema/event/event.schema';

class EventController extends CrudService<UserEvent> {
  constructor() {
    super(schema, { simpleFields: ['title'], paramsId: 'eventId' });
  }
}

export default new EventController();
