const express = require('express');
const router = express.Router();

router.use('/product', require('./product/order-product'));

module.exports = router;
