import React, { useState, useEffect } from 'react';
import Layout from '../main/Layout';
import { Link } from 'react-router-dom';
import Chart from 'react-google-charts';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';
import {
  listOrders,
  getProducts,
  getCategories,
  getStatusValues,
  updateOrderStatus,
} from '../admin/apiAdmin';
import { isAuthenticated } from '../backEnd';

export default function AdminBoard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [cate, setCates] = useState([]);
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const { user, token } = isAuthenticated();
  const loadOrders = async () => {
    const data = await listOrders(user._id, token);
    if (data.error) {
      console.log(data.error);
    } else {
      setOrders(data);
    }
  };
  const loadProducts = async () => {
    const data = await getProducts(user._id, token);
    if (data.error) {
      console.log(data.error);
    } else {
      setProducts(data);
    }
  };

  const loadCategories = async () => {
    const data = await getCategories(user._id, token);
    if (data.error) {
      console.log(data.error);
    } else {
      setCates(data);
    }
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadCategories();
  }, []);
  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Actions</h4>
        <ul className="list-group">
          <li className="list-group-item border">
            <Link className="nav-link" to="/create/category">
              Create Category
            </Link>
          </li>
          <li className="list-group-item border">
            <Link className="nav-link" to={`/create/product`}>
              Create Product
            </Link>
          </li>
          <li class="list-group-item border">
            <Link className="nav-link" to={`/admin/orders`}>
              View Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const ui = () => {};
  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">Admin Information</h3>
        <ul className="list-group">
          <li className="list-group-item border">{name}</li>
          <li className="list-group-item border">{email}</li>
          <li className="list-group-item border">
            {role === 1 ? 'Admin' : 'Regular User'}
          </li>
        </ul>
      </div>
    );
  };

  const siteInfo = () => {
    return (
      <div class="row">
        <div class="col-4">
          <div class="list-group" id="list-tab" role="tablist">
            <a
              class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center border"
              id="list-home-list"
              data-toggle="list"
              href="#list-home"
              role="tab"
              aria-controls="home"
            >
              orders
              <span class="badge badge-info badge-pill">{orders.length}</span>
            </a>
            <a
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center border"
              id="list-profile-list"
              data-toggle="list"
              href="#list-profile"
              role="tab"
              aria-controls="profile"
            >
              Products
              <span class="badge badge-info badge-pill">{products.length}</span>
            </a>
            <a
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center border"
              id="list-messages-list"
              data-toggle="list"
              href="#list-messages"
              role="tab"
              aria-controls="messages"
            >
              Categories
              <span class="badge badge-info badge-pill">{cate.length}</span>
            </a>
          </div>
        </div>
        <div class="col-8">
          <div class="tab-content" id="nav-tabContent">
            <div
              class="tab-pane fade show active"
              id="list-home"
              role="tabpanel"
              aria-labelledby="list-home-list"
            >
              <ul class="list-group">
                {orders.map((order, i) => (
                  <li className="list-group-item border">
                    <span class="badge badge-warning col-3">
                      transaction_id:
                    </span>{' '}
                    <span class="badge badge-primary col-6">
                      {order.transaction_id}
                    </span>{' '}
                  </li>
                ))}
              </ul>
            </div>
            <div
              class="tab-pane fade"
              id="list-profile"
              role="tabpanel"
              aria-labelledby="list-profile-list"
            >
              <ul class="list-group">
                {products.map((product, i) => (
                  <li className="list-group-item border">
                    <span class="badge badge-secondary col-3">
                      Name: {product.name}
                    </span>{' '}
                    <span class="badge badge-primary col-3">
                      Sold amount: {product.sold}
                    </span>{' '}
                    <span class="badge badge-info col-4">
                      {' '}
                      Price: {product.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              class="tab-pane fade"
              id="list-messages"
              role="tabpanel"
              aria-labelledby="list-messages-list"
            >
              <ul class="list-group">
                {cate.map((each, i) => (
                  <li className="list-group-item border">
                    <span class="badge badge-info col-3">Category name : </span>{' '}
                    <span class="badge badge-primary col-3">{each.name}</span>{' '}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Dashboard" description={`Hi ${name}`} className="container">
      <div className="row">
        <div className="col-3">{adminLinks()}</div>
        <div className="col-9">
          {adminInfo()}
          <div className="card mb-2">
            <h3 className="card-header">Site OverView</h3>
          </div>
          {siteInfo()}
        </div>
      </div>
    </Layout>
  );
}
