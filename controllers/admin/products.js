const asyncHandler = require('express-async-handler');
const { matchedData } = require('express-validator');

const Pagination = require('../../utils/pagination');
const Product = require('../../models/product');
const validation = require('../../validators/admin/products');

// [GET] display all products
module.exports.index = [
	validation.searchQuery,
	asyncHandler(async (req, res) => {
		const { keyword, page, status } = matchedData(req);

		const title = new RegExp(keyword?.replace(/ /g, '|'), 'i');
		const filter = {
			deleted: false,
			...(keyword && { title }),
			...(status && { status }),
		};

		const pagination = new Pagination({
			currentPage: page,
			itemPerPage: 5,
			showMaxPages: 5,
			totalItems: await Product.countDocuments(filter),
		});

		const products = await Product.find(filter)
			.skip(pagination.skip)
			.limit(pagination.itemPerPage)
			.sort({ position: -1 });

		let filterStatus = ['', ...Product.schema.path('status').enumValues];

		filterStatus = filterStatus.map((value) => ({
			label: value ? value : 'Tất cả',
			filter: value,
			isActive: value ? value === status : !status,
		}));

		res.clearCookie('alerts');
		res.render('admin/pages/products/index', {
			pageTitle: 'Quản trị - Sản phẩm',
			products,
			filter: {
				status: filterStatus,
				keyword: keyword || '',
			},
			pagination,
			alerts: req.cookies.alerts,
		});
	}),
];

// [POST] update a product
// body.product: stringified JSON object of product
module.exports.update = [
	(req, res, next) => {
		req.body.product = JSON.parse(req.body.product);
		next();
	},
	validation.update,
	asyncHandler(async (req, res) => {
		const { _id, product } = matchedData(req);
		let msg = 'Cập nhật thành công';
		if (product.deleted) {
			msg = 'Xóa thành công';
			product.deleteAt = new Date();
		}
		await Product.findByIdAndUpdate(_id, product);
		res.cookie('alerts', [
			{
				type: product.deleted ? 'warning' : 'success',
				msg,
			},
		]);
		res.redirect('back');
	}),
];

// [POST] update multiple products
// body.products: stringified JSON array of products properties to update
module.exports.bulkUpdate = [
	(req, res, next) => {
		req.body.products = JSON.parse(req.body.products);
		next();
	},
	validation.bulkUpdate,
	asyncHandler(async (req, res) => {
		const { products } = matchedData(req);
		let alerts = [];

		await Promise.all(
			products.map(async (product) => {
				const { _id, ...update } = product;
				product = await Product.findById(_id).select('title');
				if (update.delete) {
					alerts.push({
						type: 'warning',
						msg: `Xóa sản phẩm '${product.title}' thành công`,
					});
					update.deleteAt = new Date();
				} else {
					alerts.push({
						type: 'success',
						msg: `Cập nhật sản phẩm '${product.title}' thành công`,
					});
				}
				return Product.findByIdAndUpdate(_id, update);
			})
		);

		res.cookie('alerts', alerts);
		res.redirect('back');
	}),
];

// [GET] create a product
module.exports.create_page = (req, res) => {
	const alerts = req.cookies.alerts;
	const formValues = req.cookies.formValues;
	res.clearCookie('alerts');
	res.clearCookie('formValues');
	res.render('admin/pages/products/create', {
		pageTitle: 'Quản trị - Sản phẩm - Tạo mới',
		alerts,
		...formValues,
	});
};

// [POST] create a product
module.exports.create = [
	validation.create,
	asyncHandler(async (req, res) => {
		const product = new Product(matchedData(req));
		await product.save();
		res.cookie('alerts', [
			{
				type: 'success',
				msg: 'Tạo sản phẩm thành công',
			},
		]);

		res.clearCookie('alerts');
		res.clearCookie('formValues');
		res.redirect('back');
	}),
];