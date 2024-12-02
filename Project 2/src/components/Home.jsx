import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [data, setData] = useState([]); // All items from the database
  const [filteredData, setFilteredData] = useState([]); // Filtered items based on search term
  const [searchTerm, setSearchTerm] = useState(""); // Search term input
  const [cart, setCart] = useState([]); // Cart items
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching all items from the API
    axios.get('http://localhost:3000/items')
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data); // Initially, show all items
      })
      .catch(() => {
        console.log('Error fetching data');
      });
    
    // Fetch cart from localStorage if it exists
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCart(savedCart);
  }, []);

  // Add item to cart
  const addToCart = (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);

    // Save updated cart in localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    alert('Item added to cart');
  };

  // Handle cart button click
  const handleCartClick = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // If not logged in, redirect to login page
    if (!currentUser) {
      alert("Please log in to view your cart");
      navigate("/login");
    } else {
      navigate("/customerDashboard");
    }
  };

  // Handle search input change and filtering of items
  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);

    // Filter items based on the search term
    if (search.trim() === "") {
      setFilteredData(data); // Show all items if search is empty
    } else {
      const filteredItems = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) // Case-insensitive search
      );
      setFilteredData(filteredItems); // Update filtered data
    }
  };

  return (
    <div>
      {/* Search Section */}
      <div className="search-section mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search items..."
          value={searchTerm} // Bind search term to the input field
          onChange={handleSearchChange} // Update search term on change
        />
        <button className="btn btn-primary mt-2" style={{ borderRadius: '30px' }}>Go</button>
      </div>

      {/* Display Items as Boxes */}
      <div className="item-container row">
        {filteredData.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="item-box p-3 border" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h5>{item.name}</h5>
              <p>Price: {item.price}</p>
              <button className="btn btn-success" onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Button */}
      <div className="mt-3">
        <button className="btn btn-primary" onClick={handleCartClick}>
          Go to Cart ({cart.length})
        </button>
      </div>
    </div>
  );
};

export default Home;
