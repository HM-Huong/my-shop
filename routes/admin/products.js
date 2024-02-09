const express = require('express');

const router = express.Router();
const controller = require('../../controllers/admin/products');
const cloudinary = require('../../middlewares/admin/cloudinary');

// show all products
router.get('/', controller.index);
// bulk update products
router.post('/bulk-update', controller.bulkUpdate);
// create a product page
router.get('/create', controller.create_page);
// create a product
// upload.single('thumbnail') là middleware, nó sẽ xử lý file được upload trước khi đến controller.create
router.post('/create', cloudinary.upload('thumbnail'), controller.create);
// update a product
router.post('/:_id', cloudinary.upload('thumbnail'), controller.update);
// edit a product
router.get('/:_id', controller.edit_page);

module.exports = router;
