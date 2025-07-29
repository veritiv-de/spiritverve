const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRedshiftEndpoint() {
  const apiUrl = 'https://evnlyx5ji2.execute-api.us-east-1.amazonaws.com/main';
  
  console.log('Testing Redshift endpoint:', `${apiUrl}/redshift`);
  console.log('');
  
  try {
    const response = await fetch(`${apiUrl}/redshift`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Redshift Response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testRedshiftEndpoint(); 