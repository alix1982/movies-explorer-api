const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectDataErrorStatus = require('../errors/incorrectDataErrorStatus');
const ConflictUser = require('../errors/conflictUser');
const NoAuthErr = require('../errors/noAuthErr');

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
        next(new IncorrectDataErrorStatus('Ошибка валидации'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictUser('Такой пользователь уже существует'));
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
        throw new NoAuthErr('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoAuthErr('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' },
          );
          // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ token, message: 'Всё верно!' });
        });
    })
    .catch(next);
};
