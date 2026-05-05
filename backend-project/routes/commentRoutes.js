const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments
} = require('../controllers/commentController');

router.post('/', createComment);
router.get('/:blogId', getComments);

const { deleteComment } = require('../controllers/commentController');

router.delete('/:id', deleteComment);

module.exports = router;