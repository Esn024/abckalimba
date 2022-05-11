const sendResponse = (res, status, data, message = 'No message') => {
  return res.status(status).json({ status, data, message });
};

module.exports = {
  sendResponse,
};
