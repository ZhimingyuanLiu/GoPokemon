import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getOneProduct, getRelated } from './apiMain';
import Card from './Card';

export default function Product(props) {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(false);

  const loadOneProduct = async productId => {
    const data = await getOneProduct(productId);
    console.log(data);
    if (data.error) {
      setError(data.error);
    } else {
      setProduct(data);
      const relatedData = await getRelated(data._id);
      console.log(relatedData);
      if (relatedData.error) {
        setError(relatedData.error);
      } else {
        setRelated(relatedData);
      }
    }
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    console.log(productId);
    loadOneProduct(productId);
  }, [props]);
  return (
    <Layout
      title={product && product.name}
      decription={
        product && product.description && product.description.substring(0, 100)
      }
      className="container-fluid"
    >
      <div className="row">
        <div className="col-8">
          {product && product.description && (
            <Card product={product} showView={false}></Card>
          )}
        </div>
        <div className="col-4">
          <h4>Related products</h4>
          {related.map((p, i) => (
            <div className="mb-3" key={i}>
              <Card product={p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
