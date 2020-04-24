const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../utils/ErrorDB');
// sendgrid for email npm i @sendgrid/mail

exports.orderById = async (req, res, next, id) => {
  try {
    const order = await Order.findById(id).populate(
      'products.product',
      'name price'
    );
    req.order = order;
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.create = (req, res) => {
  console.log('CREATE ORDER: ', req.body);
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    // send email alert to admin
    // order.address
    // order.products.length
    // order.amount
    // const emailData = {
    //   to: 'kaloraat@gmail.com',
    //   from: 'noreply@ecommerce.com',
    //   subject: `A new order is received`,
    //   html: `
    //           <p>Customer name:</p>
    //           <p>Total products: ${order.products.length}</p>
    //           <p>Total cost: ${order.amount}</p>
    //           <p>Login to dashboard to the order in detail.</p>
    //       `,
    // };
    // sgMail.send(emailData);
    res.json(data);
  });
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', '_id name address')
      .sort('-created');
    res.json(orders);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(error),
    });
  }
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.update(
      { _id: req.body.orderId },
      { $set: { status: req.body.status } }
    );
    res.json(order);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
