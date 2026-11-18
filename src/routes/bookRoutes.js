const express = require('express');
const controller = require('../controllers/bookController');

const router = express.Router();
router.get('/', controller.getAllBooks);
router.get('/:id', controller.getBookById);
router.post('/', controller.addBook);
router.put('/:id/issue', controller.issueBook);
router.put('/:id/return', controller.returnBook);

module.exports = router;
