import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Catalog = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const config = {
          headers: {
            'Authorization': `Token ${token}`
          }
        };

        const response = await axios.get('http://localhost:8000/api/catalog/', config);
        setItems(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Catalog</h1>
      <ul>
        {items.map(item => (
          <li key={item.bookID.ISBN}>
            <h2>{item.bookID.name}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;