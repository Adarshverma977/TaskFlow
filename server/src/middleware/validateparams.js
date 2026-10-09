const AppError = require("../utils/AppError");

const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if(!result.success){
      const message = result.error.issues
      .map((issue) => issue.message)
      .join(", ")

      return next(new AppError(message, 400))
    }
    next();
  }
}

module.exports = validateParams;