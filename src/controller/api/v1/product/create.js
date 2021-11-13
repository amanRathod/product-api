const { validationResult } = require('express-validator');
const Product = require('../../../../model/product');
const { uploadFile } = require('../../../../../s3');

exports.createProduct = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error) {
      return res.status(422).json({
        success: false,
        error: error.array()[0].msg,
      });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadFile(req.file);
      imageUrl = imageUrl.Location;
    }

    const product = await Product.create({
      ...req.body,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      data: product,
    });
        
  } catch (err) {
    res.send(err);
  }
};

exports.updateProduct = async(req, res) => {
  try {
    // update product
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (err) {
    res.send(err);
  }
}

exports.deleteProduct = async(req, res) => {
  try {
    // delete product
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (err) {
    res.send(err);
  }
}

exports.getProduct = async(req, res) => {
  try {
    // get product
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (err) {
    res.send(err);
  }
}

exports.getAllProducts = async(req, res) => {
  try {
    // get all products
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({
        success: false,
        error: 'Products not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (err) {
    res.send(err);
  }
}
