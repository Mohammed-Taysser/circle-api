import { Request } from 'express';

function calculatePagination(request: Request) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export { calculatePagination };
