const Card = require('../models/card');

const serverError = 500;
const userNotFound = 404;
const badRequest = 400;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(serverError).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(serverError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(userNotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные карточки.',
        });
      } else {
        res.status(serverError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(userNotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      return res.status(serverError).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(userNotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные для удаления лайка.',
        });
      }
      return res.status(serverError).send({ message: 'Ошибка по умолчанию' });
    });
};
