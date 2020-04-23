import { API } from '../config';
import queryString from 'query-string';
export const getProduct = async (sortBy) => {
  try {
    const response = await fetch(
      `${API}/products?sortBy=${sortBy}&order=desc&limit=8`,
      {
        method: 'GET',
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: 'GET',
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getFilteredProducts = async (skip, limit, filters = {}) => {
  const data = {
    limit,
    skip,
    filters,
  };
  try {
    const response = await fetch(`${API}/products/by/search`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    return err;
  }
};

export const list = async (params) => {
  try {
    const query = queryString.stringify(params);
    console.log('query', query);
    const response = await fetch(`${API}/products/search?${query}`, {
      method: 'GET',
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getOneProduct = async (productId) => {
  try {
    const response = await fetch(`${API}/product/${productId}`, {
      method: 'GET',
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getRelated = async (productId) => {
  try {
    const response = await fetch(`${API}/products/related/${productId}`, {
      method: 'GET',
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const pay = async (userId, tokens, token, price) => {
  try {
    const response = await fetch(`${API}/stripe/getToken/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens}`,
      },
      body: JSON.stringify({ token, price }),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const creatOrder = async (userId, tokens, createdOrder) => {
  try {
    const response = await fetch(`${API}/order/create/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens}`,
      },
      body: JSON.stringify({ order: createdOrder }),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};
