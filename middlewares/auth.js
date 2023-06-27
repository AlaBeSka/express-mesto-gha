const jwt = require('jsonwebtoken');
const cfg = require('../cfg');
const UnauthorizedErr = require('../errors/unAutorize');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMsg = 'Неправильные почта или пароль';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedErr(`${errorMsg}(${authorization})!`));
  }

  const token = authorization.replace(bearer, '');
  let payload;
  try {
    payload = jwt.verify(token, cfg.SECRET_SIGNING_KEY);
  } catch (err) {
    return next(new UnauthorizedErr(`${errorMsg}!`));
  }
  req.user = payload;
  return next();
};
