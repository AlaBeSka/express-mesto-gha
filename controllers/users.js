const { ValidationError } = require('mongoose').Error;
const { CastError } = require('mongoose').Error;
const User = require('../models/user');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badReq');

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send({ users }))
    .catch(next);
};
const findUserById = (id) => User.findById(id).then((user) => {
  if (user) {
    return user;
  }
  throw new NotFoundErr('Пользователь c указанным _id не найден');
});

module.exports.getUserId = (req, res, next) => {
  const { id } = req.params;

  findUserById(id)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при поиске пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const { userId } = req.user;

  findUserById(userId)
    .then((user) => res.send({ user }))
    .catch(next);
};

const updateUserProfileData = (userId, data) => User.findByIdAndUpdate(userId, data, {
  new: true,
  runValidators: true,
}).then((user) => {
  if (user) {
    return user;
  }
  throw new NotFoundErr('Пользователь с указанным _id не найден');
}).catch((err) => {
  if (err instanceof ValidationError) {
    throw new BadRequestErr('Переданы некорректные данные при обновлении профиля');
  }
  throw err;
});

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { userId } = req.user;

  updateUserProfileData(userId, { name, about })
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { userId } = req.user;

  updateUserProfileData(userId, { avatar })
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};
