const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const routes = require('./routes/index');
const { centralErrors } = require('./controllers/centralErrors');
let { mongoUrl } = require('./utils/configDev');

// const { PORT = 3001, NODE_ENV } = process.env; // для локального хоста
const { PORT = 3000, NODE_ENV } = process.env; // для публичного сервера
const app = express();
const { MONGO_URL } = process.env;
if (NODE_ENV === 'production') { mongoUrl = MONGO_URL; }

mongoose.connect(mongoUrl);

app.use(express.json());
app.use(requestLogger);
app.use(cors);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
