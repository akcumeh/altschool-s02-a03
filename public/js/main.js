function showAddTodoForm() {
  document.getElementById('addTodoForm').style.display = 'block';
}

function hideAddTodoForm() {
  document.getElementById('addTodoForm').style.display = 'none';
}

async function updateTodoStatus(id, status) {
  try {
    const response = await fetch(`/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message || 'Error updating todo');
    }
  } catch (error) {
    alert('Error updating todo');
  }
}

async function deleteTodo(id) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  try {
    const response = await fetch(`/todos/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message || 'Error deleting todo');
    }
  } catch (error) {
    alert('Error deleting todo');
  }
}

function filterTodos(status) {
  const params = new URLSearchParams(window.location.search);
  params.set('status', status);
  window.location.search = params.toString();
}

function sortTodos(sort) {
  const params = new URLSearchParams(window.location.search);
  params.set('sort', sort);
  window.location.search = params.toString();
}
