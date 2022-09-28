module.exports.centralErrors = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next();
};
