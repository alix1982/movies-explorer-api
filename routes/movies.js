const router = require('express').Router();
const { validationRouterCreateMovie, validationRouterDeleteMovie } = require('../validations/validationRouter');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', validationRouterCreateMovie, createMovie);

router.delete('/movies/:_id', validationRouterDeleteMovie, deleteMovie);

module.exports = router;
