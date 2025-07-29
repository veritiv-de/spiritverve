const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('=== Getting API Gateway URL from AWS ===');
  
  // Read the team provider info to get the stack name
  const teamProviderPath = path.join(__dirname, 'amplify', 'team-provider-info.json');
  const teamProvider = JSON.parse(fs.readFileSync(teamProviderPath, 'utf8'));
  
  const env = 'main';
  const stackName = teamProvider[env].awscloudformation.StackName;
  const region = teamProvider[env].awscloudformation.Region;
  
  console.log(`Stack Name: ${stackName}`);
  console.log(`Region: ${region}`);
  console.log('');
  
  // Get CloudFormation outputs
  console.log('Fetching CloudFormation outputs...');
  const outputs = execSync(`aws cloudformation describe-stacks --stack-name ${stackName} --region ${region} --query 'Stacks[0].Outputs' --output json`, { encoding: 'utf8' });
  const outputsJson = JSON.parse(outputs);
  
  // Look for API Gateway URL in outputs
  let apiUrl = null;
  for (const output of outputsJson) {
    if (output.OutputKey && output.OutputKey.includes('ApiGateway') && output.OutputValue) {
      apiUrl = output.OutputValue;
      console.log(`Found API Gateway URL: ${apiUrl}`);
      break;
    }
  }
  
  if (!apiUrl) {
    console.log('API Gateway URL not found in CloudFormation outputs.');
    console.log('Trying to get it from API Gateway directly...');
    
    // Try to get it from API Gateway
    const apis = execSync(`aws apigateway get-rest-apis --region ${region} --output json`, { encoding: 'utf8' });
    const apisJson = JSON.parse(apis);
    
    for (const api of apisJson.items) {
      if (api.name && api.name.includes('helloworldapi')) {
        const apiId = api.id;
        apiUrl = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`;
        console.log(`Found API Gateway URL: ${apiUrl}`);
        break;
      }
    }
  }
  
  if (apiUrl) {
    console.log('');
    console.log('✅ SUCCESS! Here\'s your API Gateway URL:');
    console.log(apiUrl);
    console.log('');
    console.log('To use this URL:');
    console.log('1. Create a .env file in your project root');
    console.log('2. Add this line:');
    console.log(`REACT_APP_API_URL=${apiUrl}`);
    console.log('');
    console.log('Or set it as an environment variable in your deployment platform.');
  } else {
    console.log('❌ Could not find API Gateway URL automatically.');
    console.log('Please check manually in AWS Console:');
    console.log('1. Go to AWS Console > API Gateway');
    console.log('2. Find your API (helloworldapi)');
    console.log('3. Go to Stages > dev');
    console.log('4. Copy the Invoke URL');
  }
  
} catch (error) {
  console.error('Error:', error.message);
  console.log('');
  console.log('Manual instructions:');
  console.log('1. Go to AWS Console > CloudFormation');
  console.log('2. Find the stack: amplify-helloworldapp-dev');
  console.log('3. Go to the "Outputs" tab');
  console.log('4. Look for "ApiGatewayRestApiUrl" or similar');
} 