import React, { useState, useEffect } from 'react';
import './Uploads.css';


function App() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('add'); // Add or Increase mode
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    photo: null,
    itemId: '' // For increasing quantity
  });
  const [message, setMessage] = useState('');

  const fetchItems = async () => {
    const response = await fetch('http://localhost:5000/items');
    const data = await response.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    let response;
    if (mode === 'add') {
      response = await fetch('http://localhost:5000/items', {
        method: 'POST',
        body: data,
      });
    } else if (mode === 'increase') {
      response = await fetch(`http://localhost:5000/items/${formData.itemId}/increase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: parseInt(formData.quantity) }),
      });
    }

    const result = await response.json();
    setMessage(result.message || result.error);

    // Fetch items again to update the UI
    fetchItems();

    // Clear the form after submission
    setFormData({ name: '', price: '', quantity: '', photo: null, itemId: '' });

    // Refresh the page after adding the item
    window.location.reload(); // This will refresh the page and reflect the new item
  };

  return (
    <>
      <div className="container">
        <h1>Glossary Management (with File Upload)</h1>

        {/* Mode Selector */}
        <div>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="select-mode">
            <option value="add">Add New Item</option>
            <option value="increase">Increase Quantity</option>
          </select>
        </div>

        {/* Form based on Mode */}
        <form onSubmit={handleSubmit}>
          {mode === 'add' ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <select
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              required
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Qty: {item.quantity})
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          {mode === 'add' && (
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          )}

          <button type="submit">
            {mode === 'add' ? 'Add Item' : 'Increase Quantity'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>

      
    </>
  );
}

export default App;
