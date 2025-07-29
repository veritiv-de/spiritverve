import React, { useState } from 'react';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redshiftData, setRedshiftData] = useState(null);
  const [redshiftLoading, setRedshiftLoading] = useState(false);
  const [redshiftError, setRedshiftError] = useState('');

  const callBackendAPI = async () => {
    setLoading(true);
    setError('');
    
    try {
      // This will be the Amplify API endpoint
      // In production, this will be replaced with the actual API Gateway URL
      const apiUrl = process.env.REACT_APP_API_URL || 'https://your-api-id.execute-api.us-east-1.amazonaws.com/main';
      
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

  const callRedshiftQuery = async () => {
    setRedshiftLoading(true);
    setRedshiftError('');
    setRedshiftData(null);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://your-api-id.execute-api.us-east-1.amazonaws.com/main';
      
      console.log('=== REDSHIFT QUERY REQUEST ===');
      console.log('Calling Redshift endpoint:', `${apiUrl}/redshift`);
      console.log('Timestamp:', new Date().toISOString());
      
      const response = await fetch(`${apiUrl}/redshift`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response body:', responseText);
      
      if (!response.ok) {
        console.error('HTTP error response:', responseText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      console.log('Parsed Redshift data:', data);
      setRedshiftData(data);
    } catch (err) {
      console.error('=== REDSHIFT QUERY ERROR ===');
      console.error('Error details:', err);
      setRedshiftError(`Failed to query Redshift: ${err.message}`);
    } finally {
      setRedshiftLoading(false);
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

        <div className="redshift-section">
          <h2>Redshift Query:</h2>
          <button 
            onClick={callRedshiftQuery} 
            disabled={redshiftLoading}
            className="api-button redshift-button"
          >
            {redshiftLoading ? 'Querying Redshift...' : 'Query Redshift (SELECT * FROM edm.f_inv LIMIT 10)'}
          </button>
          
          {redshiftData && (
            <div className="redshift-results">
              <h3>Query Results:</h3>
              <p><strong>Message:</strong> {redshiftData.message}</p>
              <p><strong>Rows Returned:</strong> {redshiftData.rowCount}</p>
              <p><strong>Timestamp:</strong> {redshiftData.timestamp}</p>
              <p><strong>Request ID:</strong> {redshiftData.requestId}</p>
              
              {redshiftData.debug && (
                <div className="debug-info">
                  <h4>Debug Information:</h4>
                  <p><strong>Connection Host:</strong> {redshiftData.debug.connectionHost}</p>
                  <p><strong>Connection Port:</strong> {redshiftData.debug.connectionPort}</p>
                  <p><strong>Database:</strong> {redshiftData.debug.database}</p>
                  <p><strong>User:</strong> {redshiftData.debug.user}</p>
                </div>
              )}
              
              <h4>Data:</h4>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      {redshiftData.data.length > 0 && 
                        Object.keys(redshiftData.data[0]).map(key => (
                          <th key={key}>{key}</th>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {redshiftData.data.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, valueIndex) => (
                          <td key={valueIndex}>{String(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {redshiftError && (
            <div className="redshift-error">
              <h3>❌ Redshift Query Error:</h3>
              <p className="error-message">{redshiftError}</p>
              
              {/* Try to parse error response for detailed info */}
              {redshiftError.includes('body:') && (
                <div className="error-details">
                  <h4>Error Details:</h4>
                  <pre className="error-json">
                    {(() => {
                      try {
                        const errorBody = redshiftError.split('body: ')[1];
                        const parsedError = JSON.parse(errorBody);
                        return JSON.stringify(parsedError, null, 2);
                      } catch (e) {
                        return redshiftError;
                      }
                    })()}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;