const httpStatusCodes = {
  created: '201',
  badRequest: '400',
  unauthorized: '401',
  notFound: '404',
  internalServerError: '500',
};

const urlRegEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

module.exports = { httpStatusCodes, urlRegEx };
