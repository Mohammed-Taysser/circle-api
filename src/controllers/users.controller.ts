import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { IRequest } from 'types/app';
import schema from '../schema/user.schema';
import cloudinary from '../utils/cloudinary';
import { calculatePagination } from '../utils/pagination';
import { User } from 'types/user';

async function allUsers(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  const total = await schema.countDocuments();

  await schema
    .find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .populate('badges.badge')
    .populate('bookmarks.post')
    .then((users) => {
      response.status(statusCode.OK).json({ users, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function getUser(request: Request, response: Response) {
  const { id } = request.params;

  await schema
    .findById(id)
    .populate('badges.badge')
    .populate('bookmarks.post')
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

async function updateUser(req: Request, response: Response) {
  const request = req as IRequest;

  const files = request.files as Record<string, Express.Multer.File[]>;

  const { id } = request.params;

  await schema
    .findById(id)
    .populate('badges.badge')
    .populate('bookmarks.post')
    .then(async (userInstance) => {
      if (userInstance) {
        try {
          const body:Partial<User> = {
            role: request.body?.role,
            firstName: request.body?.firstName,
            lastName: request.body?.lastName,
            avatar: request.body?.avatar,
            cover: request.body?.cover,
            email: request.body?.email,
            password: request.body?.password,
            username: request.body?.username,
          };

          if (files?.cover) {
            body.cover = await cloudinary.users.uploadCover(
              files.cover,
              userInstance.cover
            );
          }

          if (files?.avatar) {
            body.avatar = await cloudinary.users.uploadAvatar(
              files.avatar,
              userInstance.avatar
            );
          }

          const user = await schema
            .findByIdAndUpdate(id, body, { new: true })
            .populate('badges.badge')
            .populate('bookmarks.post');

          response.status(statusCode.OK).json({ user });
        } catch (error) {
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

  await schema
    .findByIdAndDelete(id)
    .populate('badges.badge')
    .populate('bookmarks.post')
    .then((user) => {
      if (user) {
        response.status(statusCode.OK).json({ user });
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

  const total = await schema.countDocuments(queryFilter);

  await schema
    .find(queryFilter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)
    .populate('badges.badge')
    .populate('bookmarks.post')
    .then((users) => {
      response.status(statusCode.OK).json({ users, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

export default {
   allUsers,
   getUser,
   deleteUser,
   updateUser,
  search,
};
