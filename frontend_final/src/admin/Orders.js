import React, { useState, useEffect } from 'react';
import Layout from '../main/Layout';
import { isAuthenticated } from '../backEnd';
import { Link } from 'react-router-dom';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';
import { list } from '../main/apiMain';
import Product from '../main/Product';
import { Input } from 'semantic-ui-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([]);

  const { user, token } = isAuthenticated();
  const loadOrders = async () => {
    const data = await listOrders(user._id, token);
    if (data.error) {
      console.log(data.error);
    } else {
      setOrders(data);
    }
  };
  const loadProductStatus = async () => {
    const data = await getStatusValues(user._id, token);
    if (data.error) {
      console.log(data.error);
    } else {
      setStatus(data);
    }
  };
  useEffect(() => {
    loadOrders();
    loadProductStatus();
  }, []);

  const length = () => {
    if (orders.length > 0) {
      return (
        <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className="text-danger">Empty</h1>;
    }
  };
  const Input = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );
  const handleStatusChange = async (event, orderId) => {
    const data = await updateOrderStatus(
      user._id,
      token,
      orderId,
      event.target.value
    );
    if (data.error) {
      console.log('Status update failed');
    } else {
      loadOrders();
    }
  };

  const showStatus = (o) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status: {o.status}</h3>
      <select
        className="form-control"
        onChange={(event) => handleStatusChange(event, o._id)}
      >
        <option>Update Status</option>
        {status.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
  return (
    <Layout title="Orders" description={`Hi ${user.name}, manage the orders`}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {length()}
          {orders.map((o, oIndex) => {
            return (
              <div
                className="mt-5"
                key={oIndex}
                style={{ borderBottom: '5px solid indigo' }}
              >
                <h2 className="mb-5">
                  <span className="bg-primary">Order ID: {o._id}</span>
                </h2>
                <ul className="list-group mb-2">
                  <li className="list-group-item">{showStatus(o)}</li>
                  <li className="list-group-item">
                    Transaction ID: {o.transaction_id}
                  </li>
                  <li className="list-group-item">Amount: ${o.amount}</li>
                  <li className="list-group-item">
                    Purchased By: {o.user.name}
                  </li>
                  <li className="list-group-item">
                    Ordered on: {moment(o.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">Address: {o.address}</li>
                </ul>
                <h3 className="mt-4 mb-4 font-italic">
                  Total products in order : {o.products.length}
                </h3>
                {o.products.map((p, pIndex) => (
                  <div
                    className="mb-4"
                    key={pIndex}
                    style={{ padding: '20px', border: '1px solid' }}
                  >
                    {Input('Product name', p.name)}
                    {Input('Product price', p.price)}
                    {Input('Product total', p.count)}
                    {Input('Product ID', p._id)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
