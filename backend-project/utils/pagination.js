/**
 * Pagination helper with optimized queries
 */
exports.paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };
  const select = options.select || '';
  const populate = options.populate || '';

  // Execute queries in parallel for better performance
  const [data, total] = await Promise.all([
    model
      .find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(), // Use lean() for better performance (returns plain objects)
    model.countDocuments(query)
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
};