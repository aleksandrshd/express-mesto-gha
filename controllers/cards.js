const Card = require('../models/card');
const { httpStatusCodes } = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    console.error(err);
    return res.status(httpStatusCodes.internalServerError).json({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const newCard = await Card.create(
      { name: req.body.name, link: req.body.link, owner: req.user },
    );
    return res.status(httpStatusCodes.created).json(newCard);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(httpStatusCodes.badRequest).json({ message: `Переданы некорректные данные при создании карточки. ${errors.join(', ')}` });
    }
    return res.status(httpStatusCodes.internalServerError).json({ message: 'Произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    /*const query = await Card.findByIdAndRemove(id);*/
    const card = await Card.findById(id);

    if (!card) {
      return res.status(httpStatusCodes.notFound).json({ message: 'Карточка c указанным id не найдена' });
    }

    if (card.owner.toHexString() === req.user._id) {
      await Card.findByIdAndRemove(id);
      return res.json({ message: 'Карточка удалена' });
    } else {
      return res.status(httpStatusCodes.badRequest).json({ message: 'Удаление карточек, добавленных другими пользователями запрещено' });
    }


  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(httpStatusCodes.badRequest).json({ message: 'Передан некорректный id карточки.' });
    }
    return res.status(httpStatusCodes.internalServerError).json({ message: 'Произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!query) {
      return res.status(httpStatusCodes.notFound).json({ message: 'Карточка c указанным id не найдена' });
    }

    return res.json({ message: 'Лайк добавлен' });
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(httpStatusCodes.badRequest).json({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.status(httpStatusCodes.internalServerError).json({ message: 'Произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!query) {
      return res.status(httpStatusCodes.notFound).json({ message: 'Карточка c указанным id не найдена' });
    }

    return res.json({ message: 'Лайк удален' });
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(httpStatusCodes.badRequest).json({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
    return res.status(httpStatusCodes.internalServerError).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
