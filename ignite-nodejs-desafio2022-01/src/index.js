const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const foundUser = users.find(user => user.username === username)
  if (!foundUser) response.status(404).json({ error: 'User not found!' })

  request.user = foundUser
  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usernameExists = users.find(user => user.username === username)
  if (usernameExists) return response.status(400).json({ error: 'Username already exists!' })

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  return response.json(request.user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  request.user.todos.push(task)

  return response.status(201).json(task)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const taskId = request.params.id;

  if (!taskId) return response.status(400).json({ error: "Task id is missing from url" });

  const targetTask = request.user.todos.find(task => task.id === taskId);
  if (!targetTask) return response.status(404).json({ error: 'Task not found!' });

  if(title) targetTask.title = title;
  if (deadline) targetTask.deadline = deadline;

  return response.json(targetTask)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const taskId = request.params.id;

  const targetTask = request.user.todos.find(task => task.id === taskId);
  if (!targetTask) return response.status(404).json({ error: 'Task not found!' });

  targetTask.done = true

  return response.status(200).json(targetTask)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const taskId = request.params.id;

  const targetTaskIndex = request.user.todos.findIndex(task => task.id === taskId);
  if (targetTaskIndex < 0) return response.status(404).json({ error: 'Task not found!' });

  request.user.todos.splice(targetTaskIndex, 1);
  console.log('Cleared: ', request.user.todos)

  return response.status(204).json()
});

module.exports = app;