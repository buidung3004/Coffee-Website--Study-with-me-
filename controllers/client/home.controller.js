

// [GET] /
module.exports.index = async (req, res) => {

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
    });
}