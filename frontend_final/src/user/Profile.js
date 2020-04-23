import React, { useState, useEffect } from 'react';
import Layout from '../main/Layout';
import { Link, Redirect } from 'react-router-dom';

import { isAuthenticated } from '../backEnd';
import { read, update, updateUser } from './apiUser';
export default function Profile({ match }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: false,
    success: false,
  });
  const { token } = isAuthenticated();
  const { name, email, password, error, success } = values;
  useEffect(() => {
    init(match.params.userId);
  }, []);

  const init = async (userId) => {
    const data = await read(userId, token);
    if (data.error) {
      setValues({ ...values, error: true });
    } else {
      setValues({ ...values, name: data.name, email: data.email });
    }
  };
  const hanldeChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };
  const clickSubmit = async (e) => {
    e.preventDefault();
    const data = await update(match.params.userId, token, {
      name,
      email,
      password,
    });
    console.log(data);
    if (data.error) {
      console.log(data.error);
    } else {
      await updateUser(data, () => {
        setValues({
          ...values,
          name: data.name,
          email: data.email,
          success: true,
        });
      });
    }
  };

  const redirectUser = (success) => {
    if (success) {
      return <Redirect to="/cart" />;
    }
  };
  const updateProfile = (name, email, password) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            onChange={hanldeChange('name')}
            className="form-control"
            value={name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            onChange={hanldeChange('email')}
            className="form-control"
            value={email}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            type="password"
            onChange={hanldeChange('password')}
            className="form-control"
            value={password}
          />
        </div>
        <button onClick={clickSubmit} className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  };

  return (
    <Layout title="Profile" decription="Updating" className="container-fluid">
      <h2 className="mb-4">Profile update {name}</h2>

      {updateProfile(name, email, password)}
      {redirectUser(success)}
    </Layout>
  );
}
