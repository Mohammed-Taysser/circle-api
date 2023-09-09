import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import schema from '../schema/user.schema';
import { UserInRequest } from '../types/app';
import cloudinary from '../utils/cloudinary';
import { calculatePagination } from '../utils/pagination';

async function all(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  const total = await schema.countDocuments();

  await schema
    .find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .then((results) => {
      response.status(statusCode.OK).json({ users: results, total });
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

async function view(request: Request, response: Response) {
  const { id } = request.params;

  await schema
    .findById(id)
    .then((user) => {
      if (user) {
        response.status(statusCode.OK).json({ user });
      } else {
        response.status(statusCode.NOT_FOUND).json({ user });
      }
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

async function update(request: UserInRequest, response: Response) {
  const { files } = request;
  const { id } = request.params;
  const { role, ...body } = request.body;

  if (request?.user?.role === 'admin') {
    body.role = role;
  }

  await schema
    .findById(id)
    .then(async (userInstance) => {
      if (userInstance) {
        try {
          const body = { ...request.body };

          if (files?.cover) {
            await cloudinary.destroyer(userInstance.cover);

            const cover = await cloudinary.uploadCover(
              files.cover[0].path,
              'users'
            );
            body.cover = cover.secure_url;
          }

          if (files?.avatar) {
            await cloudinary.destroyer(userInstance.avatar);

            const avatar = await cloudinary.uploadAvatar(
              files.avatar[0].path,
              'users'
            );
            body.avatar = avatar.secure_url;
          }

          const user = await schema.findByIdAndUpdate(id, body, {
            new: true,
          });

          response.status(statusCode.OK).json({ user });
        } catch (error) {
          console.log(error);
          response.status(statusCode.BAD_REQUEST).json({ error });
        }
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'User Not Exist' });
      }
    })
    .catch(() => {
      response.status(statusCode.BAD_REQUEST).json({ error: 'User Not Exist' });
    });
}

async function deleteUser(request: UserInRequest, response: Response) {
  const { id } = request.params;

  await schema
    .findByIdAndDelete(id)
    .then((user) => {
      if (user) {
        response.status(statusCode.OK).json(user);
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'user not exist' });
      }
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

async function search(request: Request, response: Response) {
  const pagination = calculatePagination(request);
  const searchQuery = request.query.query ?? '';

  let sort = '-createAt';

  switch (request.query.sort) {
    case 'a-z':
      sort = 'firstName';
      break;
    case 'z-a':
      sort = '-firstName';
      break;
    case 'latest':
      sort = '-createdAt';
      break;
    case 'oldest':
      sort = 'createdAt';
      break;
    default:
      sort = '-createdAt';
      break;
  }

  const queryFilter = {
    $or: [
      { username: { $regex: searchQuery, $options: 'i' } },
      { email: { $regex: searchQuery, $options: 'i' } },
      { firstName: { $regex: searchQuery, $options: 'i' } },
      { lastName: { $regex: searchQuery, $options: 'i' } },
    ],
  };

  const total = await schema.countDocuments(queryFilter);

  await schema
    .find(queryFilter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)
    .then((results) => {
      response.status(statusCode.OK).json({ users: results, total });
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

export default { all, view, delete: deleteUser, update, search };
