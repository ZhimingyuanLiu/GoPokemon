import React, { useState, useEffect } from 'react';
import Layout from '../main/Layout';
import { Link } from 'react-router-dom';
import { getPurchaseHistory } from './apiUser';
import { isAuthenticated } from '../backEnd';
import moment from 'moment';
import Badge from 'react-bootstrap/Badge';

export default function UserBoard() {
  const [history, setHistory] = useState([]);
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();
  const token = isAuthenticated().token;

  const init = async (userId, token) => {
    const data = await getPurchaseHistory(userId, token);
    if (data.error) {
      console.log(data.error);
    } else {
      setHistory(data);
    }
  };

  useEffect(() => {
    init(_id, token);
  }, []);
  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Actions</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              Shoping Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to={`/profile/${_id}`}>
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = (history) => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">Purchase history</h3>
        <ul className="list-group">
          {history.map((h, i) => {
            return (
              <div className="list-group-item" key={i}>
                <h5>
                  <Link
                    to={{
                      pathname: `/user/orders/${_id}`,
                      state: { products: h.products },
                    }}
                  >
                    <span className="badge badge-secondary">order_ID</span>{' '}
                    {h.transaction_id}
                    <span className="badge badge-info ml-5">
                      {moment(h.createdAt).fromNow()}
                    </span>
                    {h.status === 'Not processed' ||
                    h.status === 'Cancelled' ? (
                      <span className="badge badge-danger ml-3">
                        {h.status}
                      </span>
                    ) : (
                      <span className="badge badge-success ml-3">
                        {h.status}
                      </span>
                    )}
                  </Link>
                </h5>
              </div>
            );
          })}
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">NAME: {name}</li>
          <li className="list-group-item">EMAIL: {email}</li>
          <li className="list-group-item">
            ROLE: {role === 1 ? 'Admin' : 'Regular User'}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout title="Dashboard" description={`Hi ${name}`} className="container">
      <div className="row">
        <div className="col-3">{userLinks()}</div>
        <div className="col-9">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
}
