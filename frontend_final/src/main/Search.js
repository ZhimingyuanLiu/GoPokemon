import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getCategories, list } from './apiMain';
import Card from './Card';

export default function Search() {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false
  });

  const { categories, category, search, results, searched } = data;
  useEffect(() => {
    loadCate();
  }, []);
  const loadCate = async () => {
    const data = await getCategories();
    if (data.error) {
      console.log(data.error);
    } else {
      setData({ ...data, categories: data });
    }
  };

  const hanldeChange = name => event => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchData = async () => {
    if (search) {
      const res = await list({
        search: search || undefined,
        category: category
      });
      if (res.error) {
        console.log(res.error);
      } else {
        setData({ ...data, results: res, searched: true });
      }
    }
  };
  const searchSubmit = event => {
    event.preventDefault();
    searchData();
  };
  const searchForm = () => {
    return (
      <form onSubmit={searchSubmit}>
        <span className="input-group-text">
          <div className="input-group input-group-lg">
            <div className="input-group-prepend">
              <select className="btn mr-2" onChange={hanldeChange('category')}>
                <option value="All">All</option>
                {categories.map((c, i) => (
                  <option key={i} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="search"
              className="form-control"
              onChange={hanldeChange('search')}
              placeholder="Search By name"
            />
          </div>
          <div className="btn input-group-append" style={{ boarder: 'none' }}>
            <button className="input-group-text">Search</button>
          </div>
        </span>
      </form>
    );
  };
  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `No products found`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>
        <div className="row">
          {results.map((product, i) => (
            <div className="col-4 mb-3">
              <Card key={i} product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="container mb-3">{searchForm()}</div>
      <div className="container-fluid mb-3">{searchedProducts(results)}</div>
    </div>
  );
}
