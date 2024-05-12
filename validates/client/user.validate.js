module.exports.registerPost = (req,res,next) => {
    if (!req.body.fullName) {
        req.flash("error", "Please enter a full name")
        res.redirect("back")
        return
    }
    if (!req.body.email) {
        req.flash("error", "Please enter a email")
        res.redirect("back")
        return
    }
    if (!req.body.password) {
        req.flash("error", "Please enter a password")
        res.redirect("back")
        return
    }
    next()

}


module.exports.loginPost = (req,res,next) => {
    if (!req.body.email) {
        req.flash("error", "Please enter a email")
        res.redirect("back")
        return
    }
    if (!req.body.password) {
        req.flash("error", "Please enter a password")
        res.redirect("back")
        return
    }
    next()

}

module.exports.forgotPasswordPost = (req,res,next) => {
    if (!req.body.email) {
        req.flash("error", "Please enter a email")
        res.redirect("back")
        return
    }

    next()
}

module.exports.resetPasswordPost = (req,res,next) => {
    if (!req.body.password) {
        req.flash("error", "Please enter a password")
        res.redirect("back")
        return
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Please enter a confirm password")
        res.redirect("back")
        return
    }

    if (req.body.password != req.body.confirmPassword) {
        req.flash("error", "Confirmation password does not match")
        res.redirect("back")
        return
    }
    next()
}
