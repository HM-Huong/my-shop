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
module.exports.update = [
	validation.update,
	asyncHandler(async (req, res) => {
		const { _id, ...product } = matchedData(req);

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
module.exports.bulkUpdate = [
	validation.bulkUpdate,
	asyncHandler(async (req, res) => {
		const {
			_id,
			title,
			description,
			price,
			discountPercentage,
			stock,
			thumbnail,
			status,
			position,
			deleted,
		} = matchedData(req);

		await Promise.all(
			_id.map(async (_id, index) => {
				return Product.findByIdAndUpdate(_id, {
					...(title && { title: title[index] }),
					...(description && { description: description[index] }),
					...(price && { price: price[index] }),
					...(discountPercentage && {
						discountPercentage: discountPercentage[index],
					}),
					...(stock && { stock: stock[index] }),
					...(thumbnail && { thumbnail: thumbnail[index] }),
					...(status && { status: status[index] }),
					...(position && { position: position[index] }),
					...(deleted && { deleted: deleted[index], deleteAt: new Date() }),
				});
			})
		);

		let alerts = [];
		if (deleted) {
			alerts.push({
				type: 'warning',
				msg: `Đã xóa ${_id.length} sản phẩm`,
			});
		} else {
			alerts.push({
				type: 'success',
				msg: `Đã cập nhật ${_id.length} sản phẩm`,
			});
		}

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
	res.render('admin/pages/products/create_edit', {
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

// [GET] product detail
module.exports.edit_page = asyncHandler(async (req, res) => {
	try {
		const product = await Product.findOne({
			_id: req.params._id,
			deleted: false,
		});
		res.clearCookie('alerts');
		res.render('admin/pages/products/create_edit', {
			pageTitle: 'Quản trị - Sản phẩm - Chỉnh sửa',
			...product.toObject(),
			alerts: req.cookies.alerts,
		});
	} catch (error) {
		res.cookie('alerts', [
			{
				type: 'error',
				msg: 'Sản phẩm không tồn tại',
			},
		]);
		res.redirect(process.env.ADMIN_PATH + '/products');
	}
});
