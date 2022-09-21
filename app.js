const express = require('express');
require('dotenv').config();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const errorRouter = require('./routes/errors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { link } = require('./utils/regulatoryExpression');

const cors = require('./middlewares/cors');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/moviedb');

app.use(express.json());

app.use(requestLogger);

app.use(cors);

// // удалить
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
// // !

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(link),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/', userRouter);

app.use('/', movieRouter);

app.use('/', errorRouter);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
