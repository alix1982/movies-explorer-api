const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectDataErrorStatus = require('../errors/incorrectDataErrorStatus');
const ConflictUser = require('../errors/conflictUser');
const NoAuthErr = require('../errors/noAuthErr');
const {
  mesErrValidation400, mesErrcreateUser409, mesErrLogin401, mesLogin,
} = require('../utils/messageServer');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const userRes = {
        name: user.name,
        email: user.email,
      };
      res.send(userRes);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataErrorStatus(mesErrValidation400));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictUser(mesErrcreateUser409));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new NoAuthErr(mesErrLogin401);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoAuthErr(mesErrLogin401);
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' },
          );
          // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ token, message: mesLogin });
        });
    })
    .catch(next);
};
