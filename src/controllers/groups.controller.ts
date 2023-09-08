import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import schema from '../schema/group.schema';
import { UserInRequest } from '../types/app';
import { calculatePagination } from '../utils/pagination';

async function all(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  const total = await schema.countDocuments();

  await schema
    .find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .then((groups) => {
      response.status(statusCode.OK).json({ groups, total });
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

async function view(request: Request, response: Response) {
  const { id } = request.params;

  await schema
    .findById(id)
    .then((group) => {
      if (group) {
        response.status(statusCode.OK).json({ group });
      } else {
        response.status(statusCode.NOT_FOUND).json({ group });
      }
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

async function create(request: Request, response: Response) {
  try {
    const newGroup = new schema(request.body);

    await newGroup
      .save()
      .then((group) => {
        response.status(statusCode.CREATED).json({ group });
      })
      .catch((error) => {
        response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
      });
  } catch (error) {
    response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function update(request: UserInRequest, response: Response) {
  const { id } = request.params;

  await schema
    .findByIdAndUpdate(id, request.body, {
      new: true,
    })
    .then((group) => {
      response.status(statusCode.OK).json({ group });
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

async function deleteUser(request: UserInRequest, response: Response) {
  const { id } = request.params;

  await schema
    .findByIdAndDelete(id)
    .then((group) => {
      if (group) {
        response.status(statusCode.OK).json(group);
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'group not exist' });
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
    .then((groups) => {
      response.status(statusCode.OK).json({ groups, total });
    })
    .catch((error) => {
      response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
    });
}

export default { all, view, create, delete: deleteUser, update, search };
