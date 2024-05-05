const express = require("express");
const path = require('path')
const methodOverride = require('method-override')

// const bodyParser = require("body-parser") // ex4.18 ver kh cần cài thêm, đã fix
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const csurf = require('csurf');

require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system")

const registerRoute = require('./routes/registration.route');
const loginRoute = require('./routes/login.route'); 
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
// parse application/x-www/form-urlencoded
app.use(express.urlencoded({ extended: false}))

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");


// Flash
app.use(cookieParser('manchesterunited'));
app.use(session({
  secret: 'manchesterunited',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000, secure: false } // set secure to true if you're using https
}));

app.use(flash());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

// Enable CSRF protection
app.use(csurf());
app.get('/register', function(req, res) {
  // pass the csrfToken to the view
  res.render('register', { csrfToken: req.csrfToken() });
});

app.post('/register', function(req, res) {
  // handle the form submission
  const username = req.body.username;
  const password = req.body.password;

  // TODO: Validate the username and password
  // TODO: Create a new user in your database

  res.send('Registration successful');
});

app.get('/login', function(req, res) {
  res.render('login', { csrfToken: req.csrfToken() });
});

//Route
app.use(registerRoute); 
app.use(loginRoute);
route(app);
routeAdmin(app);

//Error Handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

