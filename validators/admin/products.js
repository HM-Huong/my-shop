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
