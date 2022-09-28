const router = require('express').Router();
const { createUser, login } = require('../controllers/auth');
const { validationRouterCreateUser, validationRouterLogin } = require('../validations/validationRouter');

router.post('/signup', validationRouterCreateUser, createUser);

router.post('/signin', validationRouterLogin, login);

module.exports = router;
