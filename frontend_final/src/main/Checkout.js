import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../backEnd';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { emptyCart } from './cartUtils';
import { pay, creatOrder } from './apiMain';
import StripeCheckout from 'react-stripe-checkout';
import { API } from '../config';

export default function Checkout({
  products,
  setRun = (f) => f,
  run = undefined,
}) {
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const tokens = isAuthenticated() && isAuthenticated().token;

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };
  toast.configure();

  const price = getTotal();

  async function handleToken(token, address) {
    const response = await pay(userId, tokens, token, price);

    const status = response.status;

    if (status === 'success') {
      const createOrderData = {
        products: products,
        transaction_id: response.charge.id,
        amount: response.charge.amount / 100,
        address:
          response.charge.billing_details.address.line1 +
          ',' +
          response.charge.billing_details.address.city +
          ',' +
          response.charge.billing_details.address.country +
          ',' +
          response.charge.billing_details.address.postal_code,
      };
      await creatOrder(userId, tokens, createOrderData);
      toast('Success! Check email for details', { type: 'success' });
      emptyCart(() => {
        setRun(!run);
        console.log('payment success');
      });
    } else {
      toast('Something went wrong', { type: 'error' });
    }
  }

  const showCheckout = () => {
    return isAuthenticated() ? (
      <StripeCheckout
        stripeKey="pk_test_juJfvlJLH5rGoccUvaEQxkhO00LgeWZsEv"
        token={handleToken}
        billingAddress
        shippingAddress
        amount={getTotal() * 100}
      />
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };
  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {getTotal() > 0 && showCheckout()}
    </div>
  );
}
