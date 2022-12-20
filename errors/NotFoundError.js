const { httpStatusCodes } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatusCodes.notFound;
  }
}

module.exports = NotFoundError;
