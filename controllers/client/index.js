module.exports.index = (req, res) => {
	res.render('client/pages/home/index', {
		currentPath: req.baseUrl,
		pageTitle: 'Trang chủ',
	});
};
