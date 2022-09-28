const Movie = require('../models/movie');
const IncorrectDataErrorStatus = require('../errors/incorrectDataErrorStatus');
const NoDateErrorStatus = require('../errors/noDateErrorStatus');
const ConflictId = require('../errors/conflictId');
const {
  mesErrValidation400, mesErrDeleteMovie404, mesErrDeleteMovie403, mesErrDeleteMovie400,
} = require('../utils/messageServer');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataErrorStatus(mesErrValidation400));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie === null) {
        throw new NoDateErrorStatus(mesErrDeleteMovie404);
      }
      if (req.user._id !== movie.owner.toString()) {
        throw new ConflictId(mesErrDeleteMovie403);
      }
      return movie.remove();
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataErrorStatus(mesErrDeleteMovie400));
        return;
      }
      next(err);
    });
};
