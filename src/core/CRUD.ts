import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { Model } from 'mongoose';
import { FilterRequest } from '../types/app';
import { calculatePagination } from '../utils/pagination';

interface CRUDOptions<T> {
  simpleFields?: (keyof T)[]; // getAll: Fields that can be returned in simple mode
  paramsId?: string; // getById: Id param name in url
  whitelistFields?: (keyof T)[]; // update: Fields that can be updated
}

class CrudService<T extends MongoDocument> {
  protected model: Model<T>;
  protected simpleFields: (keyof T)[] = ['_id'];
  protected whitelistFields: (keyof T)[] = [];
  protected paramsId = 'id';

  constructor(model: Model<T>, options?: CRUDOptions<T>) {
    if (options?.paramsId) {
      this.paramsId = options.paramsId;
    }

    if (options?.whitelistFields) {
      this.whitelistFields = options.whitelistFields;
    }

    if (options?.simpleFields) {
      this.simpleFields = this.simpleFields.concat(options.simpleFields);
    }

    this.model = model;

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.softDelete = this.softDelete.bind(this);
  }

  async getAll(req: Request, response: Response): Promise<void | Response> {
    const request = req as FilterRequest<T>;

    const filters = request.filters;

    const pagination = calculatePagination(request);

    const isSimple = request.query.simple === 'true';

    const total = await this.model.countDocuments(filters);

    const projection = isSimple
      ? this.simpleFields.reduce(
          (prev, current) => ({ ...prev, [current]: 1, _id: 1 }),
          {}
        )
      : {};

    await this.model
      .find(filters, projection)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .then((items) => {
        response
          .status(statusCode.OK)
          .json({ meta: { ...pagination, total }, data: items });
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async getById(
    request: Request,
    response: Response
  ): Promise<void | Response> {
    const itemId = request.params[this.paramsId];
    let fieldsToSelect: (keyof T)[] = [];

    if (request.query.fields && typeof request.query.fields === 'string') {
      const splittedFields = request.query.fields
        .split(',')
        .map((field) => field.trim()) as (keyof T)[];

      fieldsToSelect = splittedFields;
    } else if (request.query.fields) {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'fields querystring is not a string' });
    }

    await this.model
      .findById(itemId)
      .select(fieldsToSelect.join(' '))
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async create(request: Request, response: Response): Promise<void | Response> {
    await new this.model(request.body)
      .save()
      .then((item) => {
        response.status(statusCode.CREATED).json({ data: item });
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async update(request: Request, response: Response): Promise<void | Response> {
    const itemId = request.params[this.paramsId];

    if (Object.keys(request.body).length === 0) {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'No data provided' });
    }

    let updateData = request.body;

    if (this.whitelistFields.length > 0) {
      const disallowedFields = Object.keys(request.body).filter(
        (field) => !this.whitelistFields.includes(field as keyof T)
      );

      if (disallowedFields.length > 0) {
        return response.status(statusCode.BAD_REQUEST).json({
          error: `The following fields are not allowed to be updated: ${disallowedFields.join(', ')}`,
        });
      }

      updateData = Object.fromEntries(
        Object.entries(request.body).filter(([key]) =>
          this.whitelistFields.includes(key as keyof T)
        )
      );
    }

    if (Object.keys(updateData).length === 0) {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'No valid fields provided' });
    }

    await this.model
      .findByIdAndUpdate(itemId, request.body, {
        runValidators: true,
        new: true,
      })
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async delete(request: Request, response: Response): Promise<void | Response> {
    const itemId = request.params[this.paramsId];

    await this.model
      .findByIdAndDelete(itemId)
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async softDelete(
    request: Request,
    response: Response
  ): Promise<void | Response> {
    const itemId = request.params[this.paramsId];

    await this.model
      .findByIdAndUpdate(
        itemId,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      )
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }
}

export default CrudService;
