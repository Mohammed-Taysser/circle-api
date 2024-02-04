import express from 'express';
import controller from '../controllers/event.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/event.validation';

const router = express.Router();

router.get('/', controller.allEvents);
router.get('/search', controller.search);
router.get('/:id', controller.getEvent);
router.post('/', authorization, validation.create, controller.createEvent);
router.patch('/:id', authorization, controller.updateEvent);
router.delete('/:id', authorization, controller.deleteEvent);

export default router;
