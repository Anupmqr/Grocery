import  { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './admin.css';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [newUser, setNewUser] = useState({ uname: '', email: '', password: '' });
  const [editItem, setEditItem] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get('http://localhost:3000/items');
        const usersResponse = await axios.get('http://localhost:3000/users');
        setItems(itemsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = async () => {
    const { name, price } = newItem;
    if (!name || !price || isNaN(price) || price <= 0) {
      alert('Please provide valid item details.');
      return;
    }
    const newItemData = { ...newItem, id: uuidv4() };
    try {
      await axios.post('http://localhost:3000/items', newItemData);
      setItems([...items, newItemData]);
      setNewItem({ name: '', price: '' });
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error.message);
      alert('Failed to add item.');
    }
  };

  const handleAddUser = async () => {
    const { uname, email, password } = newUser;
    if (!uname) {
      alert('User name is required.');
      return;
    }
    if (!email.includes('@')) {
      alert('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }
    const newUserData = { ...newUser, id: uuidv4() };
    try {
      await axios.post('http://localhost:3000/users', newUserData);
      setUsers([...users, newUserData]);
      setNewUser({ uname: '', email: '', password: '' });
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error.message);
      alert('Failed to add user.');
    }
  };

  const handleUpdateItem = async () => {
    if (!editItem.name || !editItem.price || isNaN(editItem.price) || editItem.price <= 0) {
      alert('Please provide valid item details.');
      return;
    }
    try {
      await axios.put(`http://localhost:3000/items/${editItem.id}`, editItem);
      setItems(items.map((item) => (item.id === editItem.id ? editItem : item)));
      setEditItem(null);
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error.message);
      alert('Failed to update item.');
    }
  };

  const handleUpdateUser = async () => {
    const { uname, email, password } = editUser;
    if (!uname) {
      alert('User name cannot be empty.');
      return;
    }
    if (!email.includes('@')) {
      alert('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    try {
      await axios.put(`http://localhost:3000/users/${editUser.id}`, editUser);
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      setEditUser(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error.message);
      alert('Failed to update user.');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
      alert('Item removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error.message);
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      alert('User removed successfully!');
    } catch (error) {
      console.error('Error removing user:', error.message);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>

      {/* Add Item Form */}
      <div>
        <h3>Add Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Item Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {/* Add User Form */}
      <div>
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="User Name"
          value={newUser.uname}
          onChange={(e) => setNewUser({ ...newUser, uname: e.target.value })}
        />
        <input
          type="email"
          placeholder="User Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="User Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* List Items */}
      <div>
        <h3>Items</h3>
        {items.map((item) => (
          <div key={item.id}>
            {editItem?.id === item.id ? (
              <>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editItem.price}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                />
                <button onClick={handleUpdateItem}>Save</button>
                <button onClick={() => setEditItem(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{item.name} - ${item.price}</p>
                <button onClick={() => setEditItem(item)}>Edit</button>
                <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* List Users */}
      <div>
        <h3>Users</h3>
        {users.map((user) => (
          <div key={user.id}>
            {editUser?.id === user.id ? (
              <>
                <input
                  type="text"
                  value={editUser.uname}
                  onChange={(e) => setEditUser({ ...editUser, uname: e.target.value })}
                />
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
                <input
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                />
                <button onClick={handleUpdateUser}>Save</button>
                <button onClick={() => setEditUser(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{user.uname} - {user.email}</p>
                <button onClick={() => setEditUser(user)}>Edit</button>
                <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
