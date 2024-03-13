const express = require("express");
const methodOverride = require('method-override')
// const bodyParser = require("body-parser") // ex4.18 ver kh cần cài thêm, đã fix

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

