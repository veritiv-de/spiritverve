const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkDeploymentStatus() {
    console.log('=== CHECKING DEPLOYMENT STATUS ===');
    
    // Get the API Gateway ID from the URL
    const apiUrl = 'https://evnlyx5ji2.execute-api.us-east-1.amazonaws.com/main';
    const apiId = 'evnlyx5ji2';
    
    console.log('API Gateway ID:', apiId);
    console.log('Full API URL:', apiUrl);
    
    // Test different endpoints to see what's available
    const endpoints = [
        '/hello',
        '/redshift',
        '/nonexistent',
        '/'
    ];
    
    for (const endpoint of endpoints) {
        console.log(`\n--- Testing ${endpoint} ---`);
        try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log(`Status: ${response.status}`);
            console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
            
            const responseText = await response.text();
            console.log(`Body: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
            
            if (response.status === 403 && responseText.includes('Missing Authentication Token')) {
                console.log('❌ Endpoint not deployed or not accessible');
            } else if (response.status === 200) {
                console.log('✅ Endpoint working');
            } else if (response.status === 404) {
                console.log('❌ Endpoint not found');
            }
            
        } catch (error) {
            console.error(`Error testing ${endpoint}:`, error.message);
        }
    }
    
    // Also check if we can get the API Gateway configuration
    console.log('\n=== API GATEWAY CONFIGURATION ===');
    console.log('To check API Gateway configuration manually:');
    console.log('1. Go to AWS Console → API Gateway');
    console.log('2. Find API with ID:', apiId);
    console.log('3. Check Resources tab to see if /redshift is listed');
    console.log('4. Check Stages tab to see if /redshift is deployed');
    
    // Check CloudWatch logs for recent Lambda invocations
    console.log('\n=== CLOUDWATCH LOGS ===');
    console.log('To check Lambda logs:');
    console.log('1. Go to AWS Console → CloudWatch → Log groups');
    console.log('2. Find: /aws/lambda/helloWorld-dev');
    console.log('3. Check recent log streams for any /redshift requests');
}

checkDeploymentStatus().catch(console.error); 