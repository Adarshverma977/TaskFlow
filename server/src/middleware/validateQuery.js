const AppError = require("../utils/AppError");

const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return next(new AppError(message, 400));
    }

    res.locals.validateQuery = result.data;

    next();
  };
};

module.exports = validateQuery;
