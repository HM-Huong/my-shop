const { query, body, param, validationResult } = require('express-validator');

const Product = require('../../models/product');

const status = Product.schema.path('status').enumValues;

exports.searchQuery = [
	query('keyword').optional().trim().escape(),
	query('page').optional().isInt({ min: 1 }).toInt(),
	query('status').optional().isIn(status),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.body.keyword = '';
			req.body.page = 1;
			req.body.status = '';
		}
		next();
	},
];

exports.update = [
	param('_id').isMongoId(),
	body('product.status').optional().isIn(status),
	body('product.deleted').optional().isBoolean(),
	body('product.position').optional().isInt({ min: 1 }),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			const error = new Error('Some thing went wrong');
			error.status = 400;
			next(error);
		}
		next();
	},
];

exports.bulkUpdate = [
	body('products', 'products').isArray({ min: 1 }),
	body('products.*._id', 'id').isMongoId(),
	body('products.*.status', 'status').optional().isIn(status),
	body('products.*.position', 'position').optional().isInt({ min: 1 }),
	body('products.*.delete', 'delete').optional().isBoolean(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			const error = new Error('Some thing went wrong');
			error.status = 400;
			next(error);
		}
		next();
	},
];

exports.create = [
	body('title', 'Bạn chưa nhập tên sản phẩm')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('description', 'Bạn chưa nhập mô tả sản phẩm')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('price')
		.optional()
		.isFloat({ min: 0 })
		.withMessage('Giá phải lớn hơn 0')
		.toFloat(),
	body('discountPercentage')
		.optional()
		.isFloat({ min: 0, max: 100 })
		.withMessage('Phần trăm giảm giá phải từ 0 đến 100')
		.toFloat(),
	body('stock')
		.optional()
		.isInt({ min: 0 })
		.withMessage('Số lượng phải nguyên và lớn hơn hoặc bằng 0')
		.toInt(),
	body('thumbnail').optional().trim().isURL().withMessage('URL không hợp lệ'),
	body('status').optional().isIn(status).withMessage('Trạng thái không hợp lệ'),
	body('position')
		.optional()
		.customSanitizer((value) => {
			if (!value) {
				return 1;
			}
			return value;
		})
		.isInt({ min: 1 })
		.withMessage('Vị trí phải lớn hơn 0'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			const alert = errors.array().map((error) => {
				return {
					type: 'error',
					msg: error.msg,
				};
			});
			res.cookie('alerts', alert);
			res.cookie('formValues', req.body);
			res.redirect('back');
			return;
		}
		next();
	},
];
