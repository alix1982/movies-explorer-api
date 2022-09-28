const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { mesErrCelebrateImage400, mesErrCelebrateTrailerLink400, mesErrCelebrateThumbnail400 } = require('../utils/messageServer');

module.exports.validationRouterCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationRouterLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.validationRouterUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validationRouterCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((values, helpers) => {
      if (validator.isURL(values)) { return values; }
      return helpers.message(mesErrCelebrateImage400);
    }),
    trailerLink: Joi.string().required().custom((values, helpers) => {
      if (validator.isURL(values)) { return values; }
      return helpers.message(mesErrCelebrateTrailerLink400);
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((values, helpers) => {
      if (validator.isURL(values)) { return values; }
      return helpers.message(mesErrCelebrateThumbnail400);
    }),
    movieId: Joi.number().required(),
    // owner: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationRouterDeleteMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});
