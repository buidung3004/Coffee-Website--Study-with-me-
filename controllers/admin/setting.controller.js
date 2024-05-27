const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general    
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
};

// [PATCH] /admin/settings/general    
module.exports.generalPatch = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});

        if (settingGeneral) {
            await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
        } else {
            const record = new SettingGeneral(req.body);
            await record.save();
        }

        req.flash("success", "Cập nhật thành công");
    } catch (error) {
        req.flash("error", "Có lỗi xảy ra khi cập nhật");
    }

    res.redirect("back");
};
