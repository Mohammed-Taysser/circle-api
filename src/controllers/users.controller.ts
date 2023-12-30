import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import service from '../services/user.service';
import cloudinary from '../utils/cloudinary';
import { calculatePagination } from '../utils/pagination';
import { IRequest } from 'types/user';

async function all(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  const total = await service.countDocuments();

  await service
    .all()
    .skip(pagination.skip)
    .limit(pagination.limit)

    .then((results) => {
      response.status(statusCode.OK).json({ users: results, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function view(request: Request, response: Response) {
  const { id } = request.params;

  await service
    .getById(id)

    .then((user) => {
      if (user) {
        response.status(statusCode.OK).json({ user });
      } else {
        response.status(statusCode.NOT_FOUND).json({ user });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function update(req: Request, response: Response) {
  const request = req as IRequest;

  const files = request.files as Record<string, Express.Multer.File[]>;

  const { id } = request.params;

  const { role, ...body } = request.body;

  if (request.user.role === 'admin') {
    body.role = role;
  }

  await service
    .getById(id)

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

          const user = await service.update(id, body);

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

async function deleteUser(req: Request, response: Response) {
  const request = req as IRequest;

  const { id } = request.params;

  await service
    .delete(id)

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
      response.status(statusCode.BAD_REQUEST).json({ error });
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
  }

  const queryFilter = {
    $or: [
      { username: { $regex: searchQuery, $options: 'i' } },
      { email: { $regex: searchQuery, $options: 'i' } },
      { firstName: { $regex: searchQuery, $options: 'i' } },
      { lastName: { $regex: searchQuery, $options: 'i' } },
    ],
  };

  const total = await service.countDocuments(queryFilter);

  await service
    .filter(queryFilter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)

    .then((results) => {
      response.status(statusCode.OK).json({ users: results, total });
    })
    .catch((error) => {      
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

export default { all, view, delete: deleteUser, update, search };
