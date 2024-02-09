const asyncHandler = require('express-async-handler');

const Product = require('../../models/product');

module.exports.index = asyncHandler(async (req, res) => {
	// Get all products
	const filter = {
		deleted: false,
		status: 'active',
	};
	const products = await Product.find(filter).sort({ position: -1 });

	res.render('client/pages/products/index', {
		pageTitle: 'Sản phẩm',
		products,
	});
});

// [GET] display product detail
module.exports.detail = asyncHandler(async (req, res) => {
	const { slug } = req.params;
	const product = await Product.findOne({
		slug,
		deleted: false,
		status: 'active',
	});

	if (!product) {
		const error = new Error('Not found');
		error.status = 404;
		throw error;
	}

	res.render('client/pages/products/detail', {
		pageTitle: product.title,
		product,
	});
});
