const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const uploadFile = multer();

// config cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

module.exports.upload = (field) => [
	uploadFile.single(field),
	async function (req, res, next) {
		let streamUpload = (req) => {
			return new Promise((resolve, reject) => {
				let stream = cloudinary.uploader.upload_stream((error, result) => {
					if (result) {
						resolve(result);
					} else {
						reject(error);
					}
				});

				streamifier.createReadStream(req.file.buffer).pipe(stream);
			});
		};

		async function upload(req) {
			let result = await streamUpload(req);
			req.body[req.file.fieldname] = result.secure_url;
		}

		if (req.file) {
			await upload(req);
		}
		next();
	},
];
