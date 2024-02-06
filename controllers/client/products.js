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
