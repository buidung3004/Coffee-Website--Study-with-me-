const express = require("express");
const path = require('path')
const methodOverride = require('method-override')

// const bodyParser = require("body-parser") // ex4.18 ver kh cần cài thêm, đã fix
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const csurf = require('csurf');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');

require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system")

const verifyRouter = require('./routes/verify.route');
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
app.use(cookieParser(uuidv4()));
app.use(session({
  secret: process.env.SESSION_SECRET || uuidv4(),
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
  req.session.test = 'Session is working';
  const csrfToken = req.csrfToken();
  console.log(csrfToken); // Log the CSRF token
  res.render('register', { csrfToken: req.csrfToken() });
});

// Add this route to set a test value in the session
app.get('/test-session', function(req, res) {
  req.session.test = 'Session is working';
  res.send('Session test value set');
});

// Add this route to check the test value in the session
app.get('/check-session', function(req, res) {
  res.send(req.session.test); // Should send 'Session is working'
});

//Route
app.use(registerRoute); 
app.use(loginRoute);
app.use(verifyRouter);
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

