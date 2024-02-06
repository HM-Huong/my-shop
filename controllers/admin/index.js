module.exports.index = (req, res) => {
	const adminPath = process.env.ADMIN_PATH || '/admin';
	res.redirect( adminPath + '/dashboard');
}