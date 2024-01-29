import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import schema from '../schema/group.schema';
import cloudinary from '../utils/cloudinary';
import { calculatePagination } from '../utils/pagination';
import { IRequest, MFile } from 'types/app';
import { Group } from 'types/group';

async function allGroups(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  try {
    const total = await schema.countDocuments();

    await schema
      .find()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('badges')
      .then((groups) => {
        response.status(statusCode.OK).json({ groups, total });
      });
  } catch (error) {
    response.status(statusCode.BAD_REQUEST).json({ error });
  }
}

async function getGroup(request: Request, response: Response) {
  const { id } = request.params;

  await schema
    .findById(id)
    .populate('badges')
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

async function createGroup(req: Request, response: Response) {
  const request = req as IRequest;

  const files = request.files as Record<string, MFile[]>;

  try {
    const body: Partial<Group> = {
      visibility: request.body?.visibility,
      name: request.body?.name,
    };

    if (files?.cover) {
      body.cover = await cloudinary.groups.uploadCover(files.cover);
    }

    if (files?.avatar) {
      body.avatar = await cloudinary.groups.uploadAvatar(files.avatar);
    }

    await new schema(body)
      .save()
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

async function updateGroup(req: Request, response: Response) {
  const request = req as IRequest;

  const files = request.files as Record<string, MFile[]>;

  const { id } = request.params;

  await schema
    .findById(id)
    .populate('badges')
    .then(async (groupInstance) => {
      if (groupInstance) {
        try {
          const body: Partial<Group> = {
            visibility: request.body?.visibility,
            name: request.body?.name,
          };

          if (files?.cover) {
            body.cover = await cloudinary.groups.uploadCover(
              files.cover,
              groupInstance.cover
            );
          }

          if (files?.avatar) {
            body.avatar = await cloudinary.groups.uploadAvatar(
              files.avatar,
              groupInstance.avatar
            );
          }

          const group = await schema
            .findByIdAndUpdate(id, body)
            .populate('badges');

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

async function deleteGroup(req: Request, response: Response) {
  const request = req as IRequest;

  const { id } = request.params;

  await schema
    .findByIdAndDelete(id)
    .populate('badges')
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
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

export default {
  allGroups,
  getGroup,
  createGroup,
  deleteGroup,
  updateGroup,
  search,
};
