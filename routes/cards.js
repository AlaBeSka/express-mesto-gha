const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
  deleteLikeCardValidation,
} = require('../validations/cardsValidation');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:id', deleteCardValidation, deleteCardById);
router.put('/:cardId/likes', likeCardValidation, likeCard);
router.delete('/:cardId/likes', deleteLikeCardValidation, dislikeCard);

module.exports = router;
