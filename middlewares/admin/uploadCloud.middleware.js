const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

module.exports.upload = (req, res, next) => {
    if (req.files) {
        const files = Object.values(req.files).flat();
        const uploadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        Promise.all(uploadPromises)
            .then(results => {
                results.forEach((result, index) => {
                    req.body[files[index].fieldname] = result.secure_url;
                });
                next();
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error uploading files');
            });
    } else {
        next();
    }
};