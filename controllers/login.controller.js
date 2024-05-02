exports.loginPage = (req, res) => {
  res.render("client/pages/login", {
    pageTitle: "Login"
  });
};

exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Handle login
  // ...

  res.redirect('/');
};