import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import { getCart } from './cartUtils';
import { getProduct } from './apiMain';

import Card from './Card';
import Checkout from './Checkout';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);
  const [productBySell, setproductBySell] = useState([]);
  const [error, setError] = useState(false);

  const productsBySell = async () => {
    const data = await getProduct('sold');
    if (data.error) {
      setError(data.error);
    } else {
      setproductBySell(data);
    }
  };

  useEffect(() => {
    setItems(getCart());
    productsBySell();
  }, [run]);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemove={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <h2>
      Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items. Add remove checkout or continue shopping."
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-6">
          <h2 className="mb-4">Your cart summary</h2>

          <Checkout products={items} setRun={setRun} run={run} />

          <hr />
          <h2 className="mb-4 seller">
            Best seller products{' '}
            <span role="img" aria-label="fire">
              🔥
            </span>
          </h2>
          <hr />
          <div className="row">
            {productBySell.slice(0, 4).map((product, i) => (
              <div key={i} className="mb-3 col-6">
                <Card product={product} showAddToCartButton={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
