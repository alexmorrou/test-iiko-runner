// src/KitchenOrder.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Status from './Status';

const KitchenOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/status/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const intervalId = setInterval(() => {
        fetchOrder(); // Запрос каждые 5 секунд
      }, 5000);
  
      // Очистка интервала при размонтировании компонента
      return () => clearInterval(intervalId);
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!order) return <div>No data found</div>;

  return (
    <div>
      <h1>Номер заказа: {order.Number}</h1>
      <h2>Заказ:</h2>
      <ul>
        {order.Items.map((item, index) => (
          <li key={index}>
            {item.ProductName}, <strong>Status:</strong> <Status statusNumder={item.ProcessingStatus} />
          
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KitchenOrder;