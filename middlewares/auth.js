const jwt = require('jsonwebtoken');
require('dotenv').config();
const NoAuthErr = require('../errors/noAuthErr');
const { mesErrAuth401 } = require('../utils/messageServer');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NoAuthErr(mesErrAuth401);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    next(new NoAuthErr(mesErrAuth401));
    return;
  }
  req.user = payload;
  next();
};
