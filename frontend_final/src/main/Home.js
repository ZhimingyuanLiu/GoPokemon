import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProduct } from './apiMain';
import Card from './Card';
import Search from './Search';

export default function Home() {
  const [productBySell, setproductBySell] = useState([]);
  const [productByArrival, setproductByArrival] = useState([]);
  const [error, setError] = useState(false);

  const productsBySell = async () => {
    const data = await getProduct('sold');
    if (data.error) {
      setError(data.error);
    } else {
      setproductBySell(data);
    }
  };

  const productsByArrival = async () => {
    const data = await getProduct('createdAt');
    if (data.error) {
      setError(data.error);
    } else {
      setproductByArrival(data);
    }
  };

  useEffect(() => {
    productsBySell();
    productsByArrival();
  }, []);

  return (
    <Layout
      title="Home Page"
      description="Please take a look at out Pokémons"
      className="container-fluid"
    >
      <Search />
      <h2 className="mb-4">Best Sellers</h2>
      <div className="row">
        {productBySell.map((product, i) => (
          <div key={i} className="col-3 mb-3">
            <Card product={product} showAddToCartButton={false} />
          </div>
        ))}
      </div>
      <h2 className="mb-4">New Coming</h2>
      <div className="row">
        {productByArrival.map((product, i) => (
          <div key={i} className="col-3 mb-3">
            <Card product={product} showAddToCartButton={false} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
