const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

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
	slug: {
		type: String,
		slug: 'title', // create slug from title
		slugPaddingSize: 4, // add a number has 4 digits to the end of slug if slug is duplicated
		unique: true, // make slug unique
	},
});

ProductSchema.timestamps = true;

ProductSchema.virtual('discountPrice').get(function () {
	return (this.price - (this.price * this.discountPercentage) / 100).toFixed(0);
});

const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = Product;
