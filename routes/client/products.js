const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/products');

// GET products page
router.get('/', controller.index);

// GET product detail page
router.get('/:slug', controller.detail);

module.exports = router;