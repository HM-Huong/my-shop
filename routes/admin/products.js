const express = require('express');
// const multer = require('multer');

const router = express.Router();
const controller = require('../../controllers/admin/products');
const upload = require('../../helpers/uploadImage');
//const upload = multer({ dest: 'public/uploads/' }); // dest: 'public/uploads/' là đường dẫn lưu file upload

// show all products
router.get('/', controller.index);
// bulk update products
router.post('/bulk-update', controller.bulkUpdate);
// create a product page
router.get('/create', controller.create_page);
// create a product
// upload.single('thumbnail') là middleware, nó sẽ xử lý file được upload trước khi đến controller.create
router.post('/create', upload.single('thumbnail'), controller.create);
// update a product
router.post('/:_id', upload.single('thumbnail'), controller.update);
// edit a product
router.get('/:_id', controller.edit_page);

module.exports = router;
