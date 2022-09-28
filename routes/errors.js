const router = require('express').Router();
const NoDateErrorStatus = require('../errors/noDateErrorStatus');
const { mesErrRouterErrors404 } = require('../utils/messageServer');

router.use((req, res, next) => {
  next(new NoDateErrorStatus(mesErrRouterErrors404));
});

module.exports = router;
