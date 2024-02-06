const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/index');

const dashboardRouter = require('./dashboard');
const productsRouter = require('./products');

// GET home page
router.get('/', controller.index);

router.use('/dashboard', dashboardRouter);
router.use('/products', productsRouter);

module.exports = router;
