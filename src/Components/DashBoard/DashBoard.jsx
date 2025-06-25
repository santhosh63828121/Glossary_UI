import React, { useEffect, useState } from 'react';
import EditItemForm from '../DashBoard/EditItemForm';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('http://localhost:5000/items');
    const data = await res.json();
    setItems(data);
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      const res = await fetch(`http://localhost:5000/items/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(item => item.id !== id));
        alert('Item deleted successfully');
      } else {
        alert('Failed to delete item');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Current Items</h2>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchBox}
      />
      <div style={styles.gridContainer}>
        {filteredItems.map(item => (
          <div key={item.id} style={styles.gridItem}>
            <div style={styles.imgContainer}>
              {item.photo ? (
                <img
                  src={`http://localhost:5000${item.photo}`}
                  alt={item.name}
                  style={styles.img}
                />
              ) : (
                <div style={styles.noImage}>No Image</div>
              )}
            </div>
            <div style={styles.itemDetails}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemPrice}>₹{item.price}</p>
              <p style={styles.itemQuantity}>Quantity: {item.quantity}</p>
            </div>
            <button
              style={styles.deleteButton}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
            <button  style={styles.UpdateButton} onClick={() => setEditingItem(item)} > Update</button>
          </div>
        ))}
      </div>
      {editingItem && (
        <EditItemForm
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={fetchItems}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    marginBottom: '20px',
    color: '#333',
  },
  searchBox: {
    padding: '8px 12px',
    fontSize: '14px',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '20px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
  },
  gridItem: {
    backgroundColor: '#fff',
    padding: '10px',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    textAlign: 'center',
    position: 'relative',
  },
  imgContainer: {
    marginBottom: '10px',
  },
  img: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  noImage: {
    width: '100%',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    color: '#888',
  },
  itemDetails: {
    paddingTop: '5px',
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  itemPrice: {
    fontSize: '14px',
    color: '#28a745',
    marginBottom: '6px',
  },
  itemQuantity: {
    fontSize: '12px',
    color: '#6c757d',
  },
  deleteButton: {
    marginTop: '10px',
    padding: '6px 12px',
    fontSize: '12px',
    color: '#fff',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  UpdateButton:{
    marginTop: '10px',
    padding: '6px 12px',
    fontSize: '12px',
    color: '#fff',
    marginLeft:'10px',
    backgroundColor: 'skyblue',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ItemList;
