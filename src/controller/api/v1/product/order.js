const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const { validationResult } = require('express-validator');
const Order = require('../../../../model/order');
const Coordinates = require('../../mapbox');

const transport = nodemailer.createTransport(nodemailerSendgrid({
  apiKey: process.env.SENDGRID_API_KEY,
}));

const sendEmailToAdmin = async(allOrders) => {
  // store all Address from allOrders array
  const allAddress = allOrders.map(order => order.userAddress);
  const uniqueAddress = [...new Set(allAddress)];

  // added adminAddress to uniqueAddress array on 0th index
  uniqueAddress.unshift(process.env.ADMIN_ADDRESS); 

  // send uniqueAddress to Coordinates function to get coordinates of all orders
  const coordinates = await Coordinates(uniqueAddress);

  console.log('corrrdiate', coordinates);
  // send email to shop owner with order details
  // order detail represent optimize route as in which order to visit different address.
  const EmailToAdmin = {
    to: process.env.ADMIN_EMAIL,
    from: 'aksrathod07@gmail.com',
    subject: 'New Order',
    html: `
    <h1>New Order</h1>
    <><p>You have a new order</p><p>Order Details:</p><ul>
        ${coordinates.map(address => `<li>${address}</li>`).join('')}
      </ul></>
    `,
  };

  transport.sendMail(EmailToAdmin);

}; 


exports.createOrder = async(req, res) => {
  try {
   const error = validationResult(req);
   if (!error.isEmpty()) {
     return res.status(422).json({
        status: 422,
        error: error.array()[0].msg
      });
    }
    const productId = req.params.productId;
    const order = await Order.create({
      productId,
      ...req.body
    });
    
    res.status(201).json({
      status: 201,
      data: order,
      message: "your order has been placed",
    });

    // store all pending orders without duplicate address 
    const allOrders = await Order.find({status: "packing" });
    if (allOrders.length >= 5) {
      // function to optimize route and email the order details to admin or shop kepper
      sendEmailToAdmin(allOrders); 

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getAllOrders = async(req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: 200,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

exports.getOrderById = async(req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.status(200).json({
      status: 200,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}
