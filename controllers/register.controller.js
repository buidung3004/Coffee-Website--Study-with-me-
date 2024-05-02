exports.registerPage = (req, res) => {
    res.render("client/pages/register", {
      pageTitle: "Register"
    });
  };
  
  exports.register = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Handle registration
    // ...

    res.redirect('/login');
  };

  