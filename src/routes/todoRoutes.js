const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

router.use(auth);

router.get('/', todoController.getTodos);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required')
], todoController.createTodo);

router.patch('/:id', todoController.updateTodoStatus);

router.delete('/:id', todoController.deleteTodo);

module.exports = router;
