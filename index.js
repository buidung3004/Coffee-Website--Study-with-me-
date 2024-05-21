const express = require("express");
const path = require('path')
const methodOverride = require('method-override')
const cors = require('cors');
// const bodyParser = require("body-parser") // ex4.18 ver kh cần cài thêm, đã fix
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const moment = require("moment")
// const bodyParser = require('body-parser');
require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system")

// const registerRoute = require('./routes/registration.route');
// const loginRoute = require('./routes/login.route'); 
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");


database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
// parse application/x-www/form-urlencoded
app.use(cors());
app.use(express.urlencoded({ extended: true}))
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));  // Parse application/x-www-form-urlencoded
// app.use(bodyParser.json());  // Parse application/json


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
app.locals.moment = moment
app.use(express.static(path.join(__dirname, 'public')));

// //Route
// app.use(registerRoute); 
// app.use(loginRoute);
route(app);
routeAdmin(app);

//Error Handling
app.get("*",(req,res) => {
  res.render("client/pages/errors/404",{
    pageTitle: "404 Not Found"
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

