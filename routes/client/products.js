const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/products');

// GET products page
router.get('/', controller.index);

module.exports = router;