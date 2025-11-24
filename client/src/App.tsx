import { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
}

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHello = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hello');
      const data: ApiResponse = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <div className="app">
      <h1>React + TypeScript Frontend 1</h1>
      <div className="content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{message || 'No message yet'}</p>
        )}
        <button onClick={fetchHello} disabled={loading}>
          Refresh Message
        </button>
      </div>
    </div>
  );
}

export default App;

