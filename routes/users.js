const router = require('express').Router();
const { validationRouterUpdateUser } = require('../validations/validationRouter');
const { getUserMe, updateUser } = require('../controllers/users');

router.get('/users/me', getUserMe);

router.patch('/users/me', validationRouterUpdateUser, updateUser);

module.exports = router;
