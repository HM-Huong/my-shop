const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/index');
const productsRouter = require('./products');

// GET home page
router.get('/', controller.index);

// product 
router.use('/products', productsRouter);

module.exports = router;
