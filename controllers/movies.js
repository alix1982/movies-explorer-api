const Movie = require('../models/movie');

const IncorrectDataErrorStatus = require('../errors/incorrectDataErrorStatus');
const NoDateErrorStatus = require('../errors/noDateErrorStatus');
const ConflictId = require('../errors/conflictId');
// const DefaultErrorStatus = require('../errors/defaultErrorStatus');

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
    trailerLink, nameRU, nameEN, thumbnail, movieId, owner,
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
    owner,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataErrorStatus('Ошибка валидации!'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie === null) {
        throw new NoDateErrorStatus('Карточка не найдена');
      }
      if (req.user._id !== movie.owner.toString()) {
        throw new ConflictId('Удаление не своей карточки');
      }
      return movie.remove();
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataErrorStatus('Некорректный id'));
        return;
      }
      next(err);
    });
};
