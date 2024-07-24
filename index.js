const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware and Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// Database connection
const connectionString = 'mongodb+srv://jenkincoder:tBDrGcLFDGmshTCH@cluster0.wxoptfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(connectionString, {
  maxPoolSize: 10,
}).then(() => {
  console.log('Database connection successfully');
}).catch((err) => {
  console.error('Database connection error:', err);
});

// Error handling for router imports
let adminRouter, userRouter, projectRouter;

try {
  adminRouter = require('./router/adminrouter');
} catch (error) {
  console.error('Error loading adminRouter:', error.message);
}

try {
  userRouter = require('./router/userrouter');
} catch (error) {
  console.error('Error loading userRouter:', error.message);
}

try {
  projectRouter = require('./router/projectrouter');
} catch (error) {
  console.error('Error loading projectRouter:', error.message);
}

// Routes
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/admin', projectRouter);

app.get('/', (req, res) => {
  res.render('login');
});

// Handlebars engine setup
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: false,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
