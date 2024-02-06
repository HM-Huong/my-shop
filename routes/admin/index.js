const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/index');

const dashboardRouter = require('./dashboard');


// GET home page
router.get('/', controller.index);

router.use('/dashboard', dashboardRouter);

module.exports = router;
