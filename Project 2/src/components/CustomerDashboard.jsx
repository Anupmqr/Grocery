import { useState, useEffect } from 'react';
import axios from 'axios';
import './coustemer.css';

const CustomerDashboard = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [username, setUsername] = useState('Guest');

  // Fetch username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Fetch items from JSON Server
  useEffect(() => {
    axios.get('http://localhost:3000/items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

  const handleAddToCart = async (item) => {
    try {
      const isAlreadyInCart = cart.some((cartItem) => cartItem.id === item.id);
      if (isAlreadyInCart) {
        alert('Item is already in the cart!');
        return;
      }

      const updatedCart = [...cart, item];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      const response = await axios.get('http://localhost:3000/orders', {
        params: { uname: username },
      });
      const userOrders = response.data;

      if (userOrders.length > 0) {
        const userOrder = userOrders[0];
        const updatedItems = [...userOrder.items, item];
        await axios.patch(`http://localhost:3000/orders/${userOrder.id}`, {
          items: updatedItems,
        });
      } else {
        await axios.post('http://localhost:3000/orders', {
          uname: username,
          items: [item],
        });
      }

      alert(`Item "${item.name}" added to the cart and orders!`);
    } catch (error) {
      console.error('Error adding item to the cart or orders:', error);
      alert('Failed to add item to orders. Please try again.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      const response = await axios.get('http://localhost:3000/orders', {
        params: { uname: username },
      });
      const userOrders = response.data;

      if (userOrders.length > 0) {
        const userOrder = userOrders[0];
        const updatedItems = [...userOrder.items, ...cart];
        await axios.patch(`http://localhost:3000/orders/${userOrder.id}`, {
          items: updatedItems,
        });
      } else {
        await axios.post('http://localhost:3000/orders', {
          uname: username,
          items: cart,
        });
      }

      alert('Order placed successfully!');
      localStorage.removeItem('cart');
      setCart([]);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <h2>Customer Dashboard</h2>
      
      <div>
        <h3>Items</h3>
        <div className="item-list">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h5>{item.name}</h5>
              <p>Price: {item.price}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3>Your Cart</h3>
        {cart.length > 0 ? (
          <div>
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <h5>{item.name}</h5>
                <p>Price: {item.price}</p>
              </div>
            ))}
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        ) : (
          <p>Your cart is empty!</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
