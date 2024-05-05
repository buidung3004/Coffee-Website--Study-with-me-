const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const md5 = require("md5")
// [GET] /admin/auth/login
module.exports.login =  (req, res) => {
    res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập"
    });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await Account.findOne({
        email:email,
        deleted: false
    })

    if(!user) {
        req.flash("error", "Email does not exist")
        res.redirect("back")
        return
    }
    if (md5(password) != user.password) {
        req.flash("error", "Incorrect password")
        res.redirect("back")
        return
    }
    if (user.status != "active") {
        req.flash("error", "Your account has been locked")
        res.redirect("back")
        return
    }

    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

// [GET] /admin/auth/logout
module.exports.logout =  (req, res) => {
    res.clearCookie('token')
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}