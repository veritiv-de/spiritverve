import React, { useState } from 'react';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callBackendAPI = async () => {
    setLoading(true);
    setError('');
    
    try {
      // This will be the Amplify API endpoint
      // In production, this will be replaced with the actual API Gateway URL
      const apiUrl = process.env.REACT_APP_API_URL || 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev';
      
      console.log('Environment variable REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
      console.log('Using API URL:', apiUrl);
      console.log('Full endpoint URL:', `${apiUrl}/hello`);
      
      // Check if we're using the placeholder URL
      if (apiUrl.includes('your-api-id')) {
        throw new Error('Please set REACT_APP_API_URL environment variable with your actual API Gateway URL. See env-template.txt for instructions.');
      }
      
      const response = await fetch(`${apiUrl}/hello`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      setBackendMessage(data.message);
    } catch (err) {
      setError(`Failed to fetch from backend: ${err.message}`);
      console.error('Error calling backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hackathon Amplify Bare Bones Full Stack</h1>
        
        <div className="frontend-section">
          <h2>Frontend Message:</h2>
          <p className="frontend-message">Hello from the frontend!</p>
        </div>

        <div className="backend-section">
          <h2>Backend API:</h2>
          <button 
            onClick={callBackendAPI} 
            disabled={loading}
            className="api-button"
          >
            {loading ? 'Calling API...' : 'Call Backend API'}
          </button>
          
          {backendMessage && (
            <p className="backend-message success">
              {backendMessage}
            </p>
          )}
          
          {error && (
            <p className="backend-message error">
              {error}
            </p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;