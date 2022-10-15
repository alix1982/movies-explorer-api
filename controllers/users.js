const User = require('../models/user');
const IncorrectDataErrorStatus = require('../errors/incorrectDataErrorStatus');
const NoDateErrorStatus = require('../errors/noDateErrorStatus');
const ConflictUser = require('../errors/conflictUser');
const { mesErrUpdateUser404, mesErrValidation400, mesErrUpdateUser409 } = require('../utils/messageServer');

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NoDateErrorStatus(mesErrUpdateUser404);
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new IncorrectDataErrorStatus(mesErrValidation400));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictUser(mesErrUpdateUser409));
        return;
      }
      next(err);
    });
};
