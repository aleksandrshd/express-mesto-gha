const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { httpStatusCodes } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    });
    return res.status(httpStatusCodes.created).json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      next(new BadRequestError(`Переданы некорректные данные при создании пользователя. ${errors.join(', ')}`));
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с указанным email уже зарегестрирован!'));
    }
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден!'));
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя.'));
    }
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { name: req.body.name, about: req.body.about }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      next(new NotFoundError('Пользователь не найден!'));
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      next(new BadRequestError(`Переданы некорректные данные при обновлении профиля. ${errors.join(', ')}`));
    }
    next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar: req.body.avatar }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      next(new NotFoundError('Пользователь не найден!'));
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      next(new BadRequestError(`Переданы некорректные данные при обновлении аватара. ${errors.join(', ')}`));
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      next(new UnauthorizedError('Введены некорректные почта или пароль!'));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      next(new UnauthorizedError('Введены некорректные почта или пароль!'));
    }

    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getCurrentUserInfo = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);

    if (!user) {
      next(new NotFoundError('Пользователь не найден!'));
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя!'));
    }
    next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUserInfo,
};
