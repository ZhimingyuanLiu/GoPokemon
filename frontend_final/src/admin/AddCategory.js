import React, { useState } from 'react';
import Layout from '../main/Layout';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../backEnd';
import { createCategory } from './apiAdmin';

export default function AddCategory() {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // destructer
  const { user, token } = isAuthenticated();

  const handleChange = event => {
    setError('');
    setSuccess('');
    setName(event.target.value);
  };
  const clickSubmit = async event => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    const data = await createCategory(user._id, token, { name });
    if (data.error) {
      setError(true);
    } else {
      setError('');
      setSuccess(true);
    }
  };
  const newCate = () => {
    return (
      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={name}
            autoFocus
            required
          />
        </div>
        <button className="btn btn-outline-primary">Create Category</button>
      </form>
    );
  };

  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} is created</h3>;
    }
  };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category should be unqiue</h3>;
    }
  };

  const back = () => {
    return (
      <div className="mt-5">
        <Link to="/admin/dashboard" className="text-warning">
          Go to your DashBoard
        </Link>
      </div>
    );
  };

  return (
    <Layout
      title="Add new Category"
      description={`Hi ${user.name}, please add category`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {newCate()}
          {back()}
        </div>
      </div>
    </Layout>
  );
}
