import CrudService from '../core/CRUD';
import { IEvent } from 'types/event';
import schema from '../schema/event.schema';

class EventController extends CrudService<IEvent> {
  constructor() {
    super(schema, { simpleFields: ['title'] });
  }
}

export default new EventController();
