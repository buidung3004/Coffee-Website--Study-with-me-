const md5 = require("md5")
const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const ConfirmationUser = require("../../models/confirmation-user.model")
const Cart = require("../../models/cart.model")

const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")
// [GET]/user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}

// [POST] user/register
module.exports.registerPost = async (req, res) => {
    const email = req.body.email
    const fullName = req.body.fullName
    const password = md5(req.body.password)

    const existEmail = await User.findOne({
        email: email,
        deleted: false
    })
    if(existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return
    }

    // Tạo OTP và lưu vào db
    const otp = generateHelper.generateRandomNumber(8)
    const objectConfirmationUser =  {
        email:email,
        fullName: fullName,
        password: password,
        otp: otp,
        expireAt: Date.now()
    }

    const confirmationUser = new ConfirmationUser(objectConfirmationUser)
    await confirmationUser.save()


//  Gửi mã OTP qua email
    const subject = "Mã OTP để xác minh đăng ký tài khoản. Lưu ý không để lộ mã OTP. Mã OTP có thời hạn sử dụng là 3 phút"
    const html = `
        Nhập mã OTP sau <b>${otp}</b>
    `

    sendMailHelper.sendMail(email,subject,html)


    res.redirect(`/user/register/otp?email=${email}`)


}
// [GET] user/register/otp
module.exports.otpRegister = async (req, res) => {
    const email = req.query.email
    res.render("client/pages/user/otp-register", {
        pageTitle:"Nhập mã OTP",
        email: email
    })
}

// [POST] user/register/otp
module.exports.otpRegisterPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    const result = await ConfirmationUser.findOne({
        email:email,
        otp:otp,
    }).select('email fullName password');
    if(!result) {
        req.flash("error", "OTP không hợp lệ")
        res.redirect("back")
        return
    }
    const userToSave = {
        fullName: result.fullName,
        email: result.email,
        password: result.password,
    }
    const user = new User(userToSave)
    await user.save()

    res.cookie("tokenUser", user.tokenUser)

    await ConfirmationUser.deleteOne({
        email: email
    })

    res.redirect(`/`)

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
    
// Lưu user_id vào carts
    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        user_id: user.id
    })

    res.redirect("/")
}

// [POST] user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")

    res.redirect("/")
}

// [GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle:"Lấy lại mật khẩu"
    })
}

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email 

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return
    }

// Tạo OTP và lưu vào db
    const otp = generateHelper.generateRandomNumber(8)
    const objectForgotPassword =  {
        email:email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()


//  Gửi mã OTP qua email
    const subject = "Mã OTP để xác minh lấy lại mật khẩu. Lưu ý không để lộ mã OTP. Mã OTP có thời hạn sử dụng là 2 phút"
    const html = `
        Nhập mã OTP sau <b>${otp}</b>
    `

    sendMailHelper.sendMail(email,subject,html)


    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email

    res.render("client/pages/user/otp-password", {
        pageTitle:"Nhập mã OTP",
        email: email
    })
}

// [POST] user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email:email,
        otp:otp
    })
    if(!result) {
        req.flash("error", "OTP không hợp lệ")
        res.redirect("back")
        return
    }
    const user = await User.findOne({
        email:email
    })

    res.cookie("tokenUser", user.tokenUser )

    res.redirect(`/user/password/reset`)

}

// [GET] user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle:"Đổi mật khẩu",
    })
}

// [POST] user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password 
    const tokenUser = req.cookies.tokenUser

    await User.updateOne({
        tokenUser: tokenUser
    },{
        password: md5(password)
    })

    res.redirect("/")
}

// [GET] user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle:"Thông tin tài khoản",
    })
}