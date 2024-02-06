module.exports.index = (req, res) => {
	res.render('admin/pages/dashboard/index', {
		currentPath: req.baseUrl,
		pageTitle: 'Quản trị - Trang chủ',
	});
};
