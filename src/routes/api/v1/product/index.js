const express = require('express');
const router = express.Router();

router.use('/create', require('./create'));
router.use('/order', require('./order'));

module.exports = router;
