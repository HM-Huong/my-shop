// display dashboard
module.exports.index = (req, res) => {
	res.render('admin/pages/dashboard/index', {
		pageTitle: 'Quản trị - Trang chủ',
	});
};
