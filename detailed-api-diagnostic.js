const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function detailedDiagnostic() {
    console.log('=== DETAILED API GATEWAY DIAGNOSTIC ===');
    console.log('');
    
    const apiUrl = 'https://evnlyx5ji2.execute-api.us-east-1.amazonaws.com/main';
    const apiId = 'evnlyx5ji2';
    
    console.log('API Gateway ID:', apiId);
    console.log('Base URL:', apiUrl);
    console.log('Stage: main');
    console.log('');
    
    // Test different HTTP methods on /redshift
    console.log('=== TESTING DIFFERENT HTTP METHODS ===');
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    
    for (const method of methods) {
        console.log(`\n--- Testing ${method} on /redshift ---`);
        try {
            const response = await fetch(`${apiUrl}/redshift`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log(`Status: ${response.status}`);
            console.log(`Status Text: ${response.statusText}`);
            
            const responseText = await response.text();
            console.log(`Body: ${responseText}`);
            
            if (response.status === 403 && responseText.includes('Missing Authentication Token')) {
                console.log('❌ Method not deployed or not accessible');
            } else if (response.status === 200) {
                console.log('✅ Method working');
            } else if (response.status === 405) {
                console.log('⚠️ Method not allowed (but endpoint exists)');
            } else if (response.status === 404) {
                console.log('❌ Endpoint not found');
            }
            
        } catch (error) {
            console.error(`Error testing ${method}:`, error.message);
        }
    }
    
    // Test root endpoint
    console.log('\n=== TESTING ROOT ENDPOINT ===');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log(`Root Status: ${response.status}`);
        const responseText = await response.text();
        console.log(`Root Body: ${responseText}`);
        
    } catch (error) {
        console.error('Root endpoint error:', error.message);
    }
    
    console.log('\n=== MANUAL VERIFICATION STEPS ===');
    console.log('');
    console.log('1. GO TO AWS CONSOLE → API GATEWAY');
    console.log('   https://console.aws.amazon.com/apigateway/');
    console.log('');
    console.log('2. FIND YOUR API');
    console.log('   - Search for: evnlyx5ji2');
    console.log('   - Or look for: helloworldapi');
    console.log('');
    console.log('3. CHECK RESOURCES');
    console.log('   - Click "Resources" in left menu');
    console.log('   - Look for /redshift resource');
    console.log('   - Click on /redshift');
    console.log('');
    console.log('4. CHECK METHODS');
    console.log('   - You should see GET and OPTIONS methods');
    console.log('   - If not, the CloudFormation deployment failed');
    console.log('');
    console.log('5. CHECK METHOD INTEGRATION');
    console.log('   - Click on GET method');
    console.log('   - Check "Integration type" should be "Lambda Proxy"');
    console.log('   - Check "Lambda function" should point to helloWorld');
    console.log('');
    console.log('6. CHECK STAGES');
    console.log('   - Click "Stages" in left menu');
    console.log('   - Click on "main" stage');
    console.log('   - Check "Last updated" timestamp');
    console.log('');
    console.log('7. ALTERNATIVE: CREATE MANUALLY');
    console.log('   If methods don\'t exist:');
    console.log('   - Click "Actions" → "Create Method"');
    console.log('   - Select GET');
    console.log('   - Integration type: Lambda Proxy');
    console.log('   - Lambda function: helloWorld-dev');
    console.log('   - Save and deploy');
    console.log('');
    console.log('=== CLOUDFORMATION CHECK ===');
    console.log('');
    console.log('1. GO TO CLOUDFORMATION');
    console.log('   https://console.aws.amazon.com/cloudformation/');
    console.log('');
    console.log('2. FIND STACK');
    console.log('   - Look for: amplify-spiritverve-main-*');
    console.log('   - Check for nested stack: *apihelloworldapi*');
    console.log('');
    console.log('3. CHECK EVENTS');
    console.log('   - Look for any failed events');
    console.log('   - Check if redshift methods were created');
    console.log('');
    console.log('=== NEXT STEPS ===');
    console.log('');
    console.log('Based on the diagnostic results:');
    console.log('- If all methods return 403: Methods not deployed');
    console.log('- If some methods return 405: Endpoint exists but method not allowed');
    console.log('- If all methods return 404: Resource not created');
    console.log('');
    console.log('The most likely issue is that the GET/OPTIONS methods');
    console.log('for /redshift were not properly created in CloudFormation.');
}

detailedDiagnostic().catch(console.error); 