import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function History() {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const res = await axios.get(`${API_URL}/items`);
      setItems(res.data);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoadingItems(false);
    }
  };

  const downloadSellingHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(`${API_URL}/download/sales`, { responseType: 'blob' });
      // Create a Blob object to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_history.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download sales history');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div>
      <h3>Download Reports</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button
        onClick={() => window.open(`${API_URL}/download/items`, "_blank")}
        disabled={loadingItems}
      >
        {loadingItems ? 'Downloading Items...' : 'Download Items Excel'}
      </button>

      <button
        onClick={downloadSellingHistory}
        style={{ marginLeft: '10px' }}
        disabled={loadingHistory}
      >
        {loadingHistory ? 'Downloading Sales History...' : 'Download Sales History'}
      </button>
    </div>
  );
}

export default History;
