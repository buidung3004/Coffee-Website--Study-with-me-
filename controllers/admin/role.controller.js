const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")

// [GET] /admin/roles
module.exports.index =  async (req, res) => {
    let find = {
        deleted:false
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/index", {
        pageTitle: "Trang nhóm quyền",
        records: records
    });
}

// [GET] /admin/roles
module.exports.create =  async (req, res) => {

    res.render("admin/pages/roles/create", {
        pageTitle: "Trang nhóm quyền",
    });
}

// [POST] /admin/roles
module.exports.createPost =  async (req, res) => {
    const record = new Role(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}
