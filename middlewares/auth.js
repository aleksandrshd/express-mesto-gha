const jwt = require('jsonwebtoken');

const { httpStatusCodes } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(httpStatusCodes.badRequest).json({ message: 'Необходимо авторизоваться' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {

    payload = jwt.verify(token, 'some-secret-key')

  } catch (err) {

    console.error(err);
    return res.status(httpStatusCodes.badRequest).json({ message: 'Необходимо авторизоваться' });

  }

  req.user = payload;

  next();

}