require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Product = require('../models/product');

main().catch(console.error);

async function main() {
	try {
		console.log('Connecting to database...');
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to database');

		console.log('Dropping database...');
		await mongoose.connection.dropDatabase();
		console.log('Database dropped');

		const sampleProducts = await readSampleProducts();

		// console.log(sampleProducts)

		console.log('Populating database with sample products...');
		await Promise.all(
			sampleProducts.map(async (product) => {
				const newProduct = new Product(product);
				await newProduct.save();
			})
		);
		console.log('Database populated with sample products');
	} catch (error) {
		console.log(error);
	} finally {
		console.log('Disconnecting from database...');
		await mongoose.disconnect();
		console.log('Disconnected from database');
	}
}

async function readSampleProducts() {
	const sampleProducts = await fs.promises.readFile(path.join(__dirname, 'sample_products.json'));
	return JSON.parse(sampleProducts);
}
