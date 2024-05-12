const md5 = require("md5")
const User = require("../../models/user.model")
// [GET]/user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}

// [POST] user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    if(existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return
    }
    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] user/login
module.exports.login= async (req, res) => {
    res.render("client/pages/user/login",{
        pageTitle:"Đăng nhập tài khoản",
    })
}

// [POST] user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email 
    const password = req.body.password 

    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return
    }

    if(md5(password) != user.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return
    }

    if(user.status == "inactive" ) {
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect("back");
        return
    } 
    res.cookie("tokenUser",user.tokenUser)
    
    res.redirect("/")
}

// [POST] user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")

    res.redirect("/")
}