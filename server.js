const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

// Set up Handlebars
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: false, // Disables the default layout system
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for login page
app.get('/', (req, res) => {
  res.render('login');
});

// Route for login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // In a real application, use a database to store user credentials
  const users = [
    { email: 'amitdroliya76@gmail.com', password: '1234asdf' }
  ];

  // Check if the provided email and password match any in the users array
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.render('welcome', { message: 'Login successful!' });
  } else {
    res.render('login', { error: 'Invalid email or password.' });
  }
});

// Route to provide a link after successful login
app.get('/drive-link', (req, res) => {
  res.redirect('https://docs.google.com/spreadsheets/d/18e-FYhC8E0p-fOh_D_pfa4noabGL_hEXWft9NcKEeAs/edit#gid=1933413988');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
