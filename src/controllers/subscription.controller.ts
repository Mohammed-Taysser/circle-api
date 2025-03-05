import CrudService from '../core/CRUD';
import schema from '../schema/subscription.schema';

class SubscriptionController extends CrudService<Subscription> {
  constructor() {
    super(schema);
  }
}

export default new SubscriptionController();

// async function isEmailSubscribe(request: Request, response: Response) {
//   const email = request.query.email as string;

//   await schema
//     .findOne({ email })
//     .then((subscribe) => {
//       if (subscribe) {
//         response.status(statusCode.OK).json({ subscribe });
//       } else {
//         response
//           .status(statusCode.BAD_REQUEST)
//           .json({ error: 'Email not subscribe' });
//       }
//     })
//     .catch((error) => {
//       response.status(statusCode.BAD_REQUEST).json({ error });
//     });
// }
