const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.patch('/:id', todoController.updateTodoStatus);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
