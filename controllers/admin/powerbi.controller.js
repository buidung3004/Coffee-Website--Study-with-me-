// [GET] admin/powerbi/

module.exports.index = async (req,res) => {
  res.render("admin/pages/powerbi/index", {
    pageTitle: "Trang báo cáo",
  })  
}

