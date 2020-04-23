import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './Image';
import moment from 'moment';
import { addItem, updateItem, removeItem } from './cartUtils';
export default function Card({
  product,
  showView = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemove = false,
  setRun = (f) => f,
  run = undefined,
}) {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);
  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">
            View Product
          </button>
        </Link>
      )
    );
  };
  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">Availible</span>
    ) : (
      <span className="badge badge-danger badge-pill">Not Availible</span>
    );
  };
  const remove = (showRemove) => {
    return (
      showRemove && (
        <button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };
  const showCardUpdate = (cartUpdate) => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  const addToCart = () => {
    addItem(product, setRedirect(true));
  };

  const redirectNow = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart"></Redirect>;
    }
  };
  const showAddButton = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <button
          onClick={addToCart}
          className="btn btn-outline-warning mt-2 mb-2 card-btn-1  "
        >
          Add to cart
        </button>
      )
    );
  };

  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };
  return (
    <div className="card">
      <div className="card-header bg-info name">{product.name}</div>
      <div className="card-body">
        {redirectNow(redirect)}
        <ShowImage item={product} url="product"></ShowImage>
        <p className="lead mt-2">{product.description.substring(0, 100)}</p>
        <p className="black-10">${product.price}</p>
        <p className="black-9">
          Category: {product.category && product.category.name}
        </p>
        <p className="black-8">
          Added on {moment(product.createdAt).fromNow()}
        </p>
        {showStock(product.quantity)}
        <br></br>
        {showViewButton(showView)}
        {showAddButton(showAddToCartButton)}
        {remove(showRemove)}
        {showCardUpdate(cartUpdate)}
      </div>
    </div>
  );
}
