const express = require("express");
const path = require('path')
const methodOverride = require('method-override')
// const bodyParser = require("body-parser") // ex4.18 ver kh cần cài thêm, đã fix
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const session = require('express-session')


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

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");


// Flash
app.use(cookieParser('manchesterunited'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

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

