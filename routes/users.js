const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUserMe, updateUser } = require('../controllers/users');

// router.get('/users', getUsers);

router.get('/users/me', getUserMe);

// router.get('/users/:userId', celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().required().hex().length(24),
//   }),
// }), getUserId);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

// router.patch('/users/me/avatar', celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().required().regex(link),
//   }),
// }), updateAvatar);

module.exports = router;
