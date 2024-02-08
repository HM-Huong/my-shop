const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/products');

// show all products
router.get('/', controller.index);
// bulk update products
router.post('/bulk-update', controller.bulkUpdate);
// create a product page
router.get('/create', controller.create_page);
// create a product
router.post('/create', controller.create);
// update a product
router.post('/:_id', controller.update);

module.exports = router;