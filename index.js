// Directory Structure:
// - public/         -> Contains static files (CSS, JS, images)
// - views/          -> Contains HTML templates (EJS files)
// - app.js          -> Main Node.js file
// - package.json    -> Dependencies and scripts

// Install required packages using the following commands:
// npm install express mysql ejs body-parser bootstrap

// app.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving data from database');
    }
    res.render('index', { users: results });
  });
});

app.post('/add-user', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
    if (err) {
      return res.status(500).send('Error adding user to database');
    }
    res.redirect('/');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// MySQL Schema
// CREATE TABLE users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL
// );

// public/css/style.css
// Basic styles
body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}
.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

// views/index.ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Website</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="container">
    <h1 class="text-center">Dynamic Website</h1>
    <form action="/add-user" method="POST" class="mb-4">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" name="name" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" name="email" required>
      </div>
      <button type="submit" class="btn btn-primary">Add User</button>
    </form>
    <h2>Users</h2>
    <ul class="list-group">
      <% users.forEach(user => { %>
        <li class="list-group-item"><%= user.name %> (<%= user.email %>)</li>
      <% }); %>
    </ul>
  </div>
</body>
</html>
