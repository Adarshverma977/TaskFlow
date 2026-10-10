const errorMiddleware = (err, req, res, next) => {
  
  if(err.statusCode >= 500 || !err.statusCode){
    console.error("SERVER ERROR:", err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error"

  if(err.name === "castError"){
    statusCode = 400;
    message = "Invalid resource ID";
  }

  if(err.name === "ValidationError"){
    statusCode = 400;
    message = Object.values(err.errors)
    .map((error) => error.message)
    .join(", ");
  }

  if(err instanceof SyntaxError && err.status === 400 && "body" in err){
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  if(statusCode >= 500){
    message = "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorMiddleware;