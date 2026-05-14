const Todo = require('../models/Todo');

const validateTodo = (title) => {
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }

  return errors;
};

exports.getTodos = async (req, res) => {
  try {
    const { status, sort } = req.query;
    const filter = { userId: req.userId };

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

    const isApiRequest = (req.headers.accept && req.headers.accept.includes('application/json')) ||
                         (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));

    if (isApiRequest) {
      return res.status(200).json({
        success: true,
        data: todos
      });
    }

    res.render('todos', {
      todos,
      username: req.username,
      currentStatus: status || 'all',
      currentSort: sort || 'newest'
    });
  } catch (error) {
    console.error('Error fetching todos:', error.message);

    const isApiRequest = (req.headers.accept && req.headers.accept.includes('application/json')) ||
                         (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));

    if (isApiRequest) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching todos'
      });
    }

    res.status(500).render('error', {
      error: 'Error fetching todos',
      statusCode: 500
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const validationErrors = validateTodo(title);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0]
      });
    }

    const todo = new Todo({
      title,
      description,
      userId: req.userId
    });

    await todo.save();

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error creating todo:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating todo'
    });
  }
};

exports.updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const todo = await Todo.findOne({ _id: id, userId: req.userId });

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

    const todo = await Todo.findOne({ _id: id, userId: req.userId });

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
