const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Set API Gateway URL ===');
console.log('');
console.log('Please enter your API Gateway URL:');
console.log('(It should look like: https://abc123def.execute-api.us-east-1.amazonaws.com/dev)');
console.log('');

rl.question('API Gateway URL: ', (apiUrl) => {
  // Validate the URL format
  if (!apiUrl.includes('execute-api') || !apiUrl.includes('amazonaws.com')) {
    console.log('❌ Invalid URL format. Please make sure it\'s a valid API Gateway URL.');
    rl.close();
    return;
  }
  
  // Create .env file content
  const envContent = `REACT_APP_API_URL=${apiUrl}\n`;
  
  try {
    fs.writeFileSync('.env', envContent);
    console.log('');
    console.log('✅ Success! Created .env file with your API Gateway URL.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Rebuild your application: npm run build');
    console.log('2. Deploy the updated build to Amplify');
    console.log('3. Test your API call');
  } catch (error) {
    console.log('❌ Error creating .env file:', error.message);
  }
  
  rl.close();
}); 