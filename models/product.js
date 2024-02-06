const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		price: Number,
		discountPercentage: Number,
		stock: Number,
		thumbnail: String,
		status: String,
		position: Number,
		deleted: {
			type: Boolean,
			default: false,
		},
		deleteAt: Date,
	}
);

ProductSchema.timestamps = true;

const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = Product;
