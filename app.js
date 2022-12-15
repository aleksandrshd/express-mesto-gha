const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi} = require('celebrate');
const { apiLimiter } = require('./utils/apiLimiter');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {urlRegEx} = require("./utils/constants");

const PORT = 3000;

const app = express();

app.use(helmet());

app.use(apiLimiter);

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
}), login);

app.post('/signup',celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegEx),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.use(auth);

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use('*', (req, res) => res.status(404).json({ message: 'Ошибка: запрашиваемый роут не существует' }));

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
