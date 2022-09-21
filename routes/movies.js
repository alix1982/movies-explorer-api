const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { link } = require('../utils/regulatoryExpression');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(link),
    trailerLink: Joi.string().required().regex(link),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(link),
    movieId: Joi.string().required().hex().length(24),
    owner: Joi.string().required().hex().length(24),
  }),
}), createMovie);

router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

// router.put('/cards/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().required().hex().length(24),
//   }),
// }), likeCard);

// router.delete('/cards/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().required().hex().length(24),
//   }),
// }), dislikeCard);

module.exports = router;
