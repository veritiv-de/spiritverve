const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  const apiUrl = 'https://evnlyx5ji2.execute-api.us-east-1.amazonaws.com/main';
  
  console.log('Testing API endpoint:', `${apiUrl}/hello`);
  console.log('');
  
  try {
    const response = await fetch(`${apiUrl}/hello`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! API Response:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testAPI(); 