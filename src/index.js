const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const findUser = users.find((index) => index.username === username);

  if (!findUser)
    return response.status(404).json({
      Error: "Username dont exists",
    });

  request.user = findUser;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (!name || !username) {
    return response.status(451).json({
      Error: "Error in send data",
    });
  }

  const findUsername = users.findIndex((index) => {
    return index.username == username;
  });

  const id = uuidv4();

  if (findUsername !== -1) {
    return response.status(401).json({
      Error: "Username already exists",
    });
  }

  users.push({
    id,
    name,
    username,
    todos: [],
  });

  return response.json(id);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const user = request.user;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const id = uuidv4();

  if (!title || !deadline)
    return response.status(401).json({
      Error: "Error in send data",
    });

  const todo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  /const { id } = request.params;
  const { title, deadline } = request.body;

  const { user } = request;

  if (!id) {
    return response.status(401).json({
      Error: "Error in send data",
    });
  }

  const todo = user.todos.findIndex((index) => id === index.id);

  if (todo === -1) {
    return response.status(401).json({
      Error: "Todo dont exists",
    });
  }

  user.todos[todo].title = title;
  user.todos[todo].deadline = new Date(deadline);

  return response.json(user.todos[todo]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  if (!id) {
    return response.status(401).json({
      Error: "Error in send data",
    });
  }

  const todo = user.todos.findIndex((index) => id === index.id);

  if (todo === -1) {
    return response.status(401).json({
      Error: "Todo dont exists",
    });
  }

  user.todos[todo].done = !user.todos[todo].done;

  return response.json(user.todos[todo]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  if (!id) {
    return response.status(401).json({
      Error: "Error in send data",
    });
  }

  const todo = user.todos.findIndex((index) => id === index.id);

  if (todo === -1) {
    return response.status(401).json({
      Error: "Todo dont exists",
    });
  }

  

  return response.json({
    Message : 'todo has been deleted' 
  });
});

module.exports = app;