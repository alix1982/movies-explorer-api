const router = require('express').Router();
const NoDateErrorStatus = require('../errors/noDateErrorStatus');

router.use((req, res, next) => {
  next(new NoDateErrorStatus('Не верный путь'));
});

module.exports = router;
