const { httpStatusCodes } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatusCodes.conflict;
  }
}

module.exports = ConflictError;
