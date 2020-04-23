import React, { useEffect, useState, Fragment } from 'react';

export default function RadioBox({ prices, hanldeFilters }) {
  const [value, setValue] = useState(0);

  const handleChange = event => {
    hanldeFilters(event.target.value);
    setValue(event.target.value);
  };
  return prices.map((p, i) => (
    <div key={i} className="list-unstyled">
      <input
        onChange={handleChange}
        value={`${p._id}`}
        name={p}
        type="radio"
        className="mr-2 ml-4"
      />
      <label className="form-check-label">{p.name}</label>
    </div>
  ));
}
