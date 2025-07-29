const fs = require('fs');
const path = require('path');

// Read the team provider info to get the stack name
const teamProviderPath = path.join(__dirname, 'amplify', 'team-provider-info.json');
const teamProvider = JSON.parse(fs.readFileSync(teamProviderPath, 'utf8'));

const env = 'dev'; // or whatever environment you're using
const stackName = teamProvider[env].awscloudformation.StackName;
const region = teamProvider[env].awscloudformation.Region;

console.log('=== API Gateway URL Information ===');
console.log(`Stack Name: ${stackName}`);
console.log(`Region: ${region}`);
console.log('');
console.log('To get your API Gateway URL:');
console.log('1. Go to AWS Console > CloudFormation');
console.log(`2. Find the stack: ${stackName}`);
console.log('3. Go to the "Outputs" tab');
console.log('4. Look for "ApiGatewayRestApiUrl" or similar');
console.log('5. The URL will look like: https://[api-id].execute-api.[region].amazonaws.com/[stage]');
console.log('');
console.log('Alternative method:');
console.log('1. Go to AWS Console > API Gateway');
console.log('2. Find your API (helloworldapi)');
console.log('3. Go to Stages > dev');
console.log('4. Copy the Invoke URL');
console.log('');
console.log('Once you have the URL, set it as an environment variable:');
console.log('REACT_APP_API_URL=https://your-actual-api-id.execute-api.us-east-1.amazonaws.com/dev'); 