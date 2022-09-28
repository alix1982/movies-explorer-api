const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const { centralErrors } = require('./errors/centralErrors');

const { PORT = 3000, NODE_ENV } = process.env;
const app = express();

let mongoUrl = 'mongodb://127.0.0.1:27017/moviesdb';
const { MONGO_URL } = process.env;
if (NODE_ENV === 'production') { mongoUrl = MONGO_URL; }

mongoose.connect(mongoUrl);

app.use(express.json());

app.use(routes);

app.use(centralErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
