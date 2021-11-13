const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Product = require('../../../../controller/api/v1/product/order');

router.post('/:productId', [
    body('userEmail').isEmail().withMessage('Please enter a valid email'),
    body('userPhone').isLength({ min: 10 }).withMessage('Phone must be at least 10 characters long'),
    body('userAddress').isLength({ min: 10 }).withMessage('Address must be at least 10 characters long'),
    body('orderTotal').isLength({ min: 1 }).withMessage('Order total must be at least 1 characters long'),
], Product.createOrder);


router.get('/:orderId', Product.getOrderById);
router.get('/', Product.getAllOrders);

module.exports = router;
