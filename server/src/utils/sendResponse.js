const sendResponse = (
  res,
  statusCode,
  message,
  data = null,
  extra = {}
) => {
  const response = {
    success: true,
    message
  };

  if(data !== null){
    response.data = data;
  }
  Object.assign(response, extra);

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;