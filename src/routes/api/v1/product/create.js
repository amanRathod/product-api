const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator/check');
const Product = require('../../../../controller/api/v1/product/create');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, 'IMAGE-' + Date.now() + file.originalname);
  },
});
const upload = multer({storage: storage});

router.post('/', [
    body('name').isString().isLength({ min: 1 }),
    body('description').isString().isLength({ min: 1 }),
    body('price').isNumeric(),
    body('inventory').isNumeric(),
], upload.single('file'), Product.createProduct);

router.put('/:productId', Product.updateProduct);
router.delete('/:productId', Product.deleteProduct);
router.get('/:productId', Product.getProduct);
router.get('/', Product.getAllProducts);

module.exports = router;
