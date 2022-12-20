const { httpStatusCodes } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatusCodes.unauthorized;
  }
}

module.exports = UnauthorizedError;
