// const { errors } = require('celebrate');
const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const errorRouter = require('./errors');
const auth = require('../middlewares/auth');
// const { requestLogger, errorLogger } = require('../middlewares/logger');
// const cors = require('../middlewares/cors');

// router.use(requestLogger);
// router.use(cors);
router.use(authRouter);
router.use(auth);
router.use(userRouter);
router.use(movieRouter);
router.use(errorRouter);
// router.use(errorLogger);
// router.use(errors());

module.exports = router;
