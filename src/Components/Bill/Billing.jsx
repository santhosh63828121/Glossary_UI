import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Billing.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [error, setError] = useState('');
  const billRef = useRef();
  const [itemCounts, setItemCounts] = useState({});
  const [saleId, setSaleId] = useState(null);


  // Fetch items from the server
  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(res => setItems(res.data))
      .catch(err => {
        setError('Error fetching items. Please try again.');
        console.error('Error fetching items:', err);
      });
  }, []);

  // Filter items based on the search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the total price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const updateCount = (itemId, value) => {
    const count = Math.max(1, parseInt(value) || 1); // Prevents zero/NaN
    setItemCounts(prev => ({
      ...prev,
      [itemId]: count
    }));
  };

  // Add item to the cart
  // Add item to the cart
const addToCart = (item) => {
  const count = itemCounts[item.id] || 1; // Get selected quantity
  const alreadyInCart = cart.find(cartItem => cartItem.id === item.id);

  if (alreadyInCart) {
    setCart(cart.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + count }
        : cartItem
    ));
  } else {
    setCart([...cart, { ...item, quantity: count }]);
  }

  // Reset the quantity input for this item after adding it to the cart
  setItemCounts(prev => ({
    ...prev,
    [item.id]: '' // Reset the quantity to empty
  }));
};

  // Remove item from the cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Generate and refresh the page after bill is generated
  const generateBill = (e) => {
    e.preventDefault();  // Prevent page refresh

    if (!customerName || !customerPhone) {
      setError('Customer name and phone number are required');
      return;
    }

    axios.post('http://localhost:5000/bill', {
      items: cart,
      customer_name: customerName,
      customer_phone: customerPhone
    })
      .then(res => {
        setShowBill(true);
        setTimeout(() => {
          if (billRef.current) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write(`
              <html>
                <head>
                  <title>Bill</title>
                  <style>
                    body { font-family: Arial; padding: 20px; }
                    h3 { text-align: center; }
                    ul { list-style: none; padding: 0; }
                    li { margin-bottom: 10px; }
                    .total-bill { margin-top: 20px; font-weight: bold; }
                  </style>
                </head>
                <body>
                  ${billRef.current.innerHTML}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.print();
          }
          setShowBill(false);
          setCart([]);
          setCustomerName('');
          setCustomerPhone('');
          window.location.reload();  // Refresh the page after generating the bill
        }, 500);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error generating bill. Please try again.');
      });
  };

  return (
    <div className="app-container">
      <h1>Inventory & Billing System</h1>

      <input
        type="text"
        className="search-bar"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Customer Details Form */}
      <div className="customer-details">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>

      {/* Display Error if any */}
      {error && (
        <p style={{ color: 'red', fontWeight: 'bold', paddingBottom: '20px' }}>
          {error}
        </p>
      )}

      <div className="products-list">
        {filteredItems.length ? (
          filteredItems.map(item => (
            <div key={item.id} className="product-card">
              <img src={`http://localhost:5000${item.photo}`} alt={item.name} className="item-img" />
              <div className="product-info">
                <p style={{ fontSize: '11px' }}><strong>{item.name}</strong></p>
                <p style={{ fontSize: '11px' }}>Price: ₹{item.price}</p>
                <p style={{ fontSize: '11px' }}>Stock: {item.quantity}</p>
              </div>
              <div className="cart-actions">
                <input
                  type="text"
                  value={itemCounts[item.id] || ''}  // Default to an empty string (none)
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) { // Only allow digits
                      updateCount(item.id, value === '' ? '' : parseInt(value));
                    }
                  }}
                  className="count-input"
                  placeholder="Qty"
                />


                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)}
                  disabled={item.quantity === 0}
                >
                  {item.quantity === 0 ? 'Out of Stock' : 'Add '}
                </button>
              </div>

            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      <h3 style={{ marginTop: '10px' }}>Cart</h3>
      <div className="cart-container">
        {cart.length ? (
          <ul className="cart-list">
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="total-amount">Total: ₹{total}</div>

      <button
        onClick={generateBill}
        className="generate-bill-btn"
        disabled={!cart.length}
      >
        Generate Bill
      </button>

      {showBill && (
  <div className="company-bill" ref={billRef} style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h2 style={{ margin: 0 }}>Vi-Tec Solutions Pvt. Ltd.</h2>
      <p style={{ margin: 0 }}>123 Masjith Street, Chengam, Tamil Nadu - 606701</p>
      <p style={{ margin: 0 }}>Phone: +91 9677804004 | GSTIN: 22AAAAA0000A1Z5</p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
      <div>Bill No: <strong>#{saleId}</strong></div>
      <div>Date: <strong>{new Date().toLocaleDateString()}</strong></div>
    </div>

    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2' }}>#</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2' }}>Item Name</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2' }}>Qty</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2' }}>Price</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f2f2f2' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{index + 1}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.name}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.quantity}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>₹{item.price}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>₹{item.price * item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div style={{ textAlign: 'right', marginTop: '10px' }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Total: ₹{total}</div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '13px', color: '#555' }}>
      <p>Thank you for shopping with Vi-Tec Solutions!</p>
      <p>For queries, contact us at +91 9677804004</p>
    </div>

    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={() => window.print()} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
        Print Bill
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default App;
