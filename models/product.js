const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	discountPercentage: {
		type: Number,
		default: 0,
		min: 0,
		max: 100,
	},
	stock: {
		type: Number,
		default: 0,
		min: 0,
	},
	thumbnail: String,
	status: {
		type: String,
		enum: ['active', 'inactive'],
		default: 'active',
	},
	position: {
		type: Number,
		default: 1,
		min: 1,
	},
	deleted: {
		type: Boolean,
		default: false,
	},
	deleteAt: Date,
});

ProductSchema.timestamps = true;

ProductSchema.virtual('discountPrice').get(function () {
	return (this.price - (this.price * this.discountPercentage) / 100).toFixed(0);
});

const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = Product;
