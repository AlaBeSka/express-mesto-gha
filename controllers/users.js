const User = require('../models/user');

const serverError = 500;
const userNotFound = 404;
const badRequest = 400;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(serverError).send({ message: 'Server error' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(userNotFound).send({ message: 'User not found' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(badRequest)
          .send({
            message: 'Переданы некорректные данные при поиске пользователя',
          });
      } else {
        res.status(serverError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(serverError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(userNotFound).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(serverError).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(userNotFound).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(serverError).send({ message: 'Ошибка по умолчанию' });
    });
};
