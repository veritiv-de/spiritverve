const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRedshiftEndpoint() {
    console.log('=== TESTING REDSHIFT ENDPOINT ===');
    
    // Get the API URL from environment or use the known one
    const apiUrl = process.env.REACT_APP_API_URL || 'https://evnlyx5ji2.execute-api.us-east-1.amazonaws.com/main';
    const redshiftUrl = `${apiUrl}/redshift`;
    
    console.log('Testing URL:', redshiftUrl);
    console.log('Timestamp:', new Date().toISOString());
    
    try {
        console.log('Making request...');
        const response = await fetch(redshiftUrl, {
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
            console.error('❌ HTTP Error Response:');
            console.error('Status:', response.status);
            console.error('Status Text:', response.statusText);
            console.error('Body:', responseText);
            return;
        }
        
        const data = JSON.parse(responseText);
        console.log('✅ Success! Parsed data:', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('❌ Fetch Error:');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        if (error.code) {
            console.error('Error code:', error.code);
        }
    }
}

// Also test the /hello endpoint to make sure the API is working
async function testHelloEndpoint() {
    console.log('\n=== TESTING HELLO ENDPOINT ===');
    
    const apiUrl = process.env.REACT_APP_API_URL || 'https://evnlyx5ji2.execute-api.us-east-1.amazonaws.com/main';
    const helloUrl = `${apiUrl}/hello`;
    
    console.log('Testing URL:', helloUrl);
    
    try {
        const response = await fetch(helloUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText);
        
        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ Hello endpoint working:', data);
        } else {
            console.error('❌ Hello endpoint failed:', response.status, responseText);
        }
        
    } catch (error) {
        console.error('❌ Hello endpoint error:', error.message);
    }
}

// Run both tests
async function runTests() {
    await testHelloEndpoint();
    await testRedshiftEndpoint();
}

runTests().catch(console.error); 