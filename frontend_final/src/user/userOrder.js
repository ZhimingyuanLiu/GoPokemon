import React from 'react';
import Layout from '../main/Layout';

export default function userOrder({ location, match }) {
  console.log(JSON.stringify(location.state));
  console.log(match.params.userId);

  return (
    <Layout
      title="Individual order"
      description="Order Details for each transaction"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-2">
          {location.state.products.map((p, i) => {
            return (
              <li key={i} className="list-group-item">
                <h6>Product name: {p.name}</h6>
                <h6>Product price: ${p.price}</h6>
                <h6>Product quantity: {p.count}</h6>
              </li>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
