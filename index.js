const express = require("express");
const methodOverride = require('method-override')
// const bodyParser = require("body-parser") // ex4.18 ver kh cần cài thêm, đã fix
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const session = require('express-session')


require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system")

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
// parse application/x-www/form-urlencoded
app.use(express.urlencoded({ extended: false}))
// Flash
app.use(cookieParser('manchesterunited'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.set("views", "./views");
app.set("view engine", "pug");

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));
//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

