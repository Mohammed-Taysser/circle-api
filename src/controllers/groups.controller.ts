import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import service from '../services/group.service';
import cloudinary from '../utils/cloudinary';
import { calculatePagination } from '../utils/pagination';
import { IRequest } from 'types/app';

async function all(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  try {
    const total = await service.countDocuments();

    await service
      .all()
      .skip(pagination.skip)
      .limit(pagination.limit)

      .then((groups) => {
        response.status(statusCode.OK).json({ groups, total });
      });
  } catch (error) {
    response.status(statusCode.BAD_REQUEST).json({ error });
  }
}

async function view(request: Request, response: Response) {
  const { id } = request.params;

  await service
    .getById(id)

    .then((group) => {
      if (group) {
        response.status(statusCode.OK).json({ group });
      } else {
        response.status(statusCode.NOT_FOUND).json({ group });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function create(request: Request, response: Response) {
  try {
    await service
      .save(request.body)
      .then((group) => {
        response.status(statusCode.CREATED).json({ group });
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  } catch (error) {
    response.status(statusCode.BAD_REQUEST).json({ error });
  }
}

async function update(req: Request, response: Response) {
  const request = req as IRequest;

  const files = request.files as Record<string, Express.Multer.File[]>;

  const { id } = request.params;

  await service
    .getById(id)

    .then(async (groupInstance) => {
      if (groupInstance) {
        try {
          const body = { ...request.body };

          if (files?.cover) {
            await cloudinary.destroyer(groupInstance.cover);

            const cover = await cloudinary.uploadCover(
              files.cover[0].path,
              'groups'
            );
            body.cover = cover.secure_url;
          }

          if (files?.avatar) {
            await cloudinary.destroyer(groupInstance.avatar);

            const avatar = await cloudinary.uploadAvatar(
              files.avatar[0].path,
              'groups'
            );
            body.avatar = avatar.secure_url;
          }

          const group = await service.update(id, body);

          response.status(statusCode.OK).json({ group });
        } catch (error) {
          response.status(statusCode.BAD_REQUEST).json({ error });
        }
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'Group Not Exist' });
      }
    })
    .catch(() => {
      response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'Group Not Exist' });
    });
}

async function deleteItem(req: Request, response: Response) {
  const request = req as IRequest;

  const { id } = request.params;

  await service
    .delete(id)

    .then((group) => {
      if (group) {
        response.status(statusCode.OK).json({ group });
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'group not exist' });
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
      sort = 'name';
      break;
    case 'z-a':
      sort = '-name';
      break;
    case 'latest':
      sort = '-createdAt';
      break;
    case 'oldest':
      sort = 'createdAt';
      break;
  }

  const queryFilter = {
    $or: [{ name: { $regex: searchQuery, $options: 'i' } }],
  };

  const total = await service.countDocuments(queryFilter);

  await service
    .filter(queryFilter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)

    .then((groups) => {
      response.status(statusCode.OK).json({ groups, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

export default { all, view, create, delete: deleteItem, update, search };
