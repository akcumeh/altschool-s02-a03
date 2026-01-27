const Todo = require('../models/Todo');
const { validationResult } = require('express-validator');

exports.getTodos = async (req, res) => {
  try {
    const { status, sort } = req.query;
    const filter = { userId: req.session.userId };

    if (status && status !== 'all') {
      filter.status = status;
    } else {
      filter.status = { $in: ['pending', 'completed'] };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'status') {
      sortOption = { status: 1, createdAt: -1 };
    }

    const todos = await Todo.find(filter).sort(sortOption);

    res.render('todos', {
      todos,
      username: req.session.username,
      currentStatus: status || 'all',
      currentSort: sort || 'newest'
    });
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    res.status(500).render('error', {
      error: 'Error fetching todos',
      statusCode: 500
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect('/todos?error=' + encodeURIComponent(errors.array()[0].msg));
    }

    const { title, description } = req.body;

    const todo = new Todo({
      title,
      description,
      userId: req.session.userId
    });

    await todo.save();

    res.redirect('/todos');
  } catch (error) {
    console.error('Error creating todo:', error.message);
    res.redirect('/todos?error=' + encodeURIComponent('Error creating todo'));
  }
};

exports.updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const todo = await Todo.findOne({ _id: id, userId: req.session.userId });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo.status = status;
    await todo.save();

    res.json({
      success: true,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    console.error('Error updating todo:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating todo'
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, userId: req.session.userId });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo.status = 'deleted';
    await todo.save();

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting todo'
    });
  }
};
