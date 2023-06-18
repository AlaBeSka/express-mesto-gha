const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648ef2829f015f4ce7620578',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});
