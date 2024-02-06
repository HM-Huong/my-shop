const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/products');

// GET: show all products
router.get('/', controller.index);
// POST: bulk update products
router.post('/bulk-update', controller.bulkUpdate);
// POST: update a product
router.post('/:_id', controller.update);

module.exports = router;