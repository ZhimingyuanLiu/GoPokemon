import React, { useState } from 'react';
import Layout from '../main/Layout';
import { Redirect } from 'react-router-dom';
import { SignInUser, isAuthenticated, authenticate } from '../backEnd';

export default function Signin() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    reditectToReferrer: false
  });

  const { email, password, loading, error, reditectToReferrer } = values;
  const { user } = isAuthenticated();
  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const postToBackEnd = async event => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    const data = await SignInUser({ email, password });
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      authenticate(data, () => {
        setValues({
          ...values,
          reditectToReferrer: true
        });
      });
    }
  };
  function form() {
    return (
      <form>
        <div className="form-group">
          <label>Email</label>
          <input
            onChange={handleChange('email')}
            type="email"
            className="form-control"
            value={email}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            onChange={handleChange('password')}
            type="password"
            className="form-control"
            value={password}
          />
        </div>

        <button
          onClick={postToBackEnd}
          type="submit"
          className="btn btn-primary btn-block"
        >
          Sign Up
        </button>
        <p className="forgot-password text-right">
          Already registered <a href="/signin">sign in?</a>
        </p>
      </form>
    );
  }

  const Error = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? '' : 'none' }}
      >
        {error}
      </div>
    );
  };

  const Loading = () => {
    if (loading) {
      return <div className="alert alert-info">Please wait .....</div>;
    }
  };

  const redirectUser = () => {
    if (reditectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };
  return (
    <Layout
      title="Signin"
      decription="Log into your account"
      className="container col-mid-8 offset-mid-2"
    >
      {Loading()}
      {Error()}
      {form()}
      {redirectUser()}
    </Layout>
  );
}
