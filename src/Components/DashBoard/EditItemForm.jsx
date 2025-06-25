import React, { useState } from 'react';
import axios from 'axios';

const EditItemForm = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    photo: null,
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("price", formData.price);
    updateData.append("quantity", formData.quantity);
    if (formData.photo) {
      updateData.append("photo", formData.photo);
    }

    try {
      await axios.put(`http://localhost:5000/items/${item.id}`, updateData);
    //   alert("Item updated successfully");
      onUpdate();   // Refresh the list
      onClose();    // Close the form
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3>Update Item</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          <input type="file" name="photo" onChange={handleFileChange} />
          <br /><br />
          <button type="submit">Save</button>
          <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center'
  },
  content: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    minWidth: '300px'
  }
};

export default EditItemForm;
