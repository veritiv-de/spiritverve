import React, { useState } from 'react';
import './App.css';

// Helper function to determine data type
const getDataType = (value) => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string') {
    // Check if it's a date
    if (/^\d{4}-\d{2}-\d{2}/.test(value) || /^\d{2}\/\d{2}\/\d{4}/.test(value)) {
      return 'date';
    }
    // Check if it's a number string
    if (!isNaN(value) && value.trim() !== '') return 'number';
    return 'string';
  }
  return 'string';
};

// Helper function to format values based on data type
const formatValue = (value, dataType) => {
  if (value === null || value === undefined) return 'NULL';
  
  switch (dataType) {
    case 'number':
      return typeof value === 'string' ? parseFloat(value).toLocaleString() : value.toLocaleString();
    case 'date':
      try {
        const date = new Date(value);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      } catch {
        return value;
      }
    case 'boolean':
      return value ? '✓' : '✗';
    case 'string':
      // Truncate long strings
      if (value.length > 50) {
        return value.substring(0, 47) + '...';
      }
      return value;
    default:
      return String(value);
  }
};

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
      console.log('Environment API URL:', process.env.REACT_APP_API_URL);
      
      const response = await fetch(`${apiUrl}/redshift`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response body:', responseText);
      console.log('Response body length:', responseText.length);
      
      if (!response.ok) {
        console.error('HTTP error response:', responseText);
        
        // Try to parse error details
        let errorDetails = {};
        try {
          errorDetails = JSON.parse(responseText);
        } catch (e) {
          errorDetails = { rawError: responseText };
        }
        
        // Check for specific API Gateway errors
        if (response.status === 403) {
          if (responseText.includes('Missing Authentication Token')) {
            throw new Error(`API Gateway Error: Endpoint not deployed or not accessible. Status: ${response.status}. Please check if the /redshift methods are properly configured in API Gateway.`);
          } else {
            throw new Error(`API Gateway Error: Access denied. Status: ${response.status}. Response: ${responseText}`);
          }
        } else if (response.status === 500) {
          throw new Error(`Lambda Error: Server error. Status: ${response.status}. Check Lambda logs for details. Response: ${responseText}`);
        } else if (response.status === 502) {
          throw new Error(`Lambda Error: Bad gateway. Status: ${response.status}. Lambda function may have crashed. Response: ${responseText}`);
        } else if (response.status === 504) {
          throw new Error(`Lambda Error: Gateway timeout. Status: ${response.status}. Lambda function may have timed out. Response: ${responseText}`);
        } else {
          throw new Error(`HTTP Error: Status ${response.status}. Response: ${responseText}`);
        }
      }
      
      const data = JSON.parse(responseText);
      console.log('Parsed Redshift data:', data);
      setRedshiftData(data);
    } catch (err) {
      console.error('=== REDSHIFT QUERY ERROR ===');
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      // Set detailed error message
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
              <h3>Query Results</h3>
              
              {/* Summary Statistics */}
              <div className="results-summary">
                <div className="summary-item">
                  <div className="summary-label">Rows Returned</div>
                  <div className="summary-value">{redshiftData.rowCount}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Columns</div>
                  <div className="summary-value">{redshiftData.data.length > 0 ? Object.keys(redshiftData.data[0]).length : 0}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Request ID</div>
                  <div className="summary-value">{redshiftData.requestId.substring(0, 8)}...</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Timestamp</div>
                  <div className="summary-value">{new Date(redshiftData.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
              
              <p><strong>Message:</strong> {redshiftData.message}</p>
              
              {redshiftData.debug && (
                <div className="debug-info">
                  <h4>Connection Details</h4>
                  <p><strong>Host:</strong> {redshiftData.debug.connectionHost}</p>
                  <p><strong>Port:</strong> {redshiftData.debug.connectionPort}</p>
                  <p><strong>Database:</strong> {redshiftData.debug.database}</p>
                  <p><strong>User:</strong> {redshiftData.debug.user}</p>
                  {redshiftData.debug.vpcSecurityGroup && (
                    <p><strong>VPC Security Group:</strong> {redshiftData.debug.vpcSecurityGroup}</p>
                  )}
                </div>
              )}
              
              <h4>Data Preview</h4>
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
                        {Object.entries(row).map(([key, value], valueIndex) => {
                          // Determine data type for better formatting
                          const dataType = getDataType(value);
                          const formattedValue = formatValue(value, dataType);
                          
                          return (
                            <td 
                              key={valueIndex} 
                              data-type={dataType}
                              title={typeof value === 'string' && value.length > 50 ? value : undefined}
                            >
                              {formattedValue}
                            </td>
                          );
                        })}
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