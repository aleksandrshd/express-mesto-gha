const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { apiLimiter } = require('./utils/apiLimiter');

const routes = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');

const PORT = 3000;

const app = express();

app.use(helmet());

app.use(apiLimiter);

app.use(bodyParser.json());

app.use(routes);

app.use(errors());

app.use(errorsHandler);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
  });
});
