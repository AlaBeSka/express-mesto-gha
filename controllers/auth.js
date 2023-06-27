const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const cfg = require('../cfg');

const UnauthorizedErr = require('../errors/unAutorize');
const ConflictErr = require('../errors/conflict');
const BadRequestErr = require('../errors/badReq');

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign({ userId }, cfg.SECRET_SIGNING_KEY, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedErr('Неправильные почта или пароль'));
    });
};

module.exports.registrationUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;
      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictErr(
          'Пользователь с таким электронным адресом уже зарегистрирован',
        );
      }
      throw new BadRequestErr(
        'Переданы некорректные данные при регистрации пользователя',
      );
    })
    .catch(next);
};
