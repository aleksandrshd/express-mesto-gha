const { httpStatusCodes } = require('../utils/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatusCodes.forbidden;
  }
}

module.exports = ForbiddenError;
