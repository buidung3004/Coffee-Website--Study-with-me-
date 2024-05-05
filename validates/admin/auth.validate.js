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
