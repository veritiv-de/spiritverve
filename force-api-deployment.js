console.log('=== FORCE API GATEWAY DEPLOYMENT ===');
console.log('');
console.log('The /redshift endpoint is still not deployed. Here are the steps to fix this:');
console.log('');
console.log('OPTION 1: Wait for Amplify Deployment');
console.log('1. Go to AWS Amplify Console');
console.log('2. Check if the latest deployment is still in progress');
console.log('3. Wait for it to complete (usually 5-10 minutes)');
console.log('');
console.log('OPTION 2: Force New Deployment');
console.log('1. Make a small change to trigger a new deployment');
console.log('2. Or manually deploy the API Gateway changes');
console.log('');
console.log('OPTION 3: Manual API Gateway Update');
console.log('1. Go to AWS Console → API Gateway');
console.log('2. Find API: evnlyx5ji2');
console.log('3. Go to Resources tab');
console.log('4. Check if /redshift resource exists');
console.log('5. If not, manually create it or redeploy');
console.log('');
console.log('OPTION 4: Check CloudFormation Stack');
console.log('1. Go to AWS Console → CloudFormation');
console.log('2. Find stack: amplify-spiritverve-main-*');
console.log('3. Check if there are any deployment errors');
console.log('4. Look for API Gateway nested stack');
console.log('');
console.log('Current API Gateway ID: evnlyx5ji2');
console.log('Current Stage: main');
console.log('Expected endpoints: /hello (working), /redshift (not working)');
console.log('');
console.log('Let\'s try making a small change to force a new deployment...');

// Create a simple change to trigger deployment
const fs = require('fs');
const path = require('path');

// Add a comment to the Lambda function to trigger deployment
const lambdaPath = path.join(__dirname, 'amplify', 'backend', 'function', 'helloWorld', 'src', 'index.js');

if (fs.existsSync(lambdaPath)) {
    const content = fs.readFileSync(lambdaPath, 'utf8');
    if (!content.includes('// Force deployment')) {
        const newContent = content.replace(
            'console.log(`=== LAMBDA FUNCTION STARTED ===`);',
            'console.log(`=== LAMBDA FUNCTION STARTED ===`);\n    // Force deployment - ' + new Date().toISOString()
        );
        fs.writeFileSync(lambdaPath, newContent);
        console.log('✅ Added deployment trigger comment to Lambda function');
        console.log('Now commit and push to trigger a new deployment:');
        console.log('git add .');
        console.log('git commit -m "Force API Gateway deployment"');
        console.log('git push origin main');
    } else {
        console.log('⚠️  Deployment trigger already exists');
    }
} else {
    console.log('❌ Lambda function file not found');
} 