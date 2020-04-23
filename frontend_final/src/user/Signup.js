import React, { useState } from 'react';
import Layout from '../main/Layout';
import { Link } from 'react-router-dom';
import { createUser } from '../backEnd';
export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  });

  const { name, email, password, success, error } = values;
  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const postToBackEnd = async event => {
    event.preventDefault();
    setValues({ ...values, error: false });
    const data = await createUser({ name, email, password });
    if (data.error) {
      setValues({ ...values, error: data.error, success: false });
    } else {
      setValues({
        ...values,
        name: '',
        email: '',
        password: '',
        error: '',
        success: true
      });
    }
  };
  function form() {
    return (
      <form>
        <div className="form-group">
          <label>Name</label>
          <input
            onChange={handleChange('name')}
            type="text"
            className="form-control"
            value={name}
          />
        </div>

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

  const Success = () => {
    return (
      <div
        className="alert alert-info"
        style={{ display: success ? '' : 'none' }}
      >
        You have successfully created your accout, Please{' '}
        <Link to="/signin"> Sign in</Link>
      </div>
    );
  };
  return (
    <Layout
      title="Signup"
      decription="Create your account"
      className="container col-mid-8 offset-mid-2"
    >
      {Success()}
      {Error()}
      {form()}
    </Layout>
  );
}
