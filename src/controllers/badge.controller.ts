import { IBadge } from 'types/badge';
import CrudService from '../core/CRUD';
import schema from '../schema/badge.schema';

class BadgeController extends CrudService<IBadge> {
  constructor() {
    super(schema, { simpleFields: ['label'] });
  }
}

export default new BadgeController();
