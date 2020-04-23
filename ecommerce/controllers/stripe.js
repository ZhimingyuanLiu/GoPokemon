require('dotenv').config();
const User = require('../models/user');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const uuid = require('node-uuid');

exports.generateToken = async (req, res) => {
  console.log('testing');
  console.log('Request:', req.body);

  let error;
  let status;
  try {
    const { price, token } = req.body;
    console.log(req.body);
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotency_key = uuid.v1();
    const charge = await stripe.charges.create(
      {
        amount: price * 100,
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased those product`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        idempotency_key,
      }
    );

    status = 'success';
    res.json({ charge, status });
  } catch (error) {
    status = 'failure';
    res.json({ error, status });
  }
};
