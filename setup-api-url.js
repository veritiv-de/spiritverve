const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ApiUrlSetup {
  constructor() {
    this.teamProviderPath = path.join(__dirname, 'amplify', 'team-provider-info.json');
    this.teamProvider = JSON.parse(fs.readFileSync(this.teamProviderPath, 'utf8'));
    this.env = 'main';
    this.stackName = this.teamProvider[this.env].awscloudformation.StackName;
    this.region = this.teamProvider[this.env].awscloudformation.Region;
    this.appId = this.getAppId();
  }

  getAppId() {
    // Try to extract app ID from team provider info or use a placeholder
    try {
      // This might need to be adjusted based on your actual team-provider-info.json structure
      return this.teamProvider[this.env].awscloudformation.StackName.split('-')[1] || 'your-app-id';
    } catch (error) {
      console.log('Could not extract app ID automatically. You may need to set it manually.');
      return 'your-app-id';
    }
  }

  async getApiGatewayUrl() {
    console.log('🔍 Extracting API Gateway URL from CloudFormation...');
    console.log(`Stack: ${this.stackName}`);
    console.log(`Region: ${this.region}`);
    console.log('');

    try {
      // Method 1: Try to get from CloudFormation outputs
      console.log('📋 Checking CloudFormation outputs...');
      const outputs = execSync(
        `aws cloudformation describe-stacks --stack-name ${this.stackName} --region ${this.region} --query 'Stacks[0].Outputs' --output json`,
        { encoding: 'utf8' }
      );
      
      const outputsJson = JSON.parse(outputs);
      
      // Look for API Gateway URL in outputs - check multiple possible output names
      for (const output of outputsJson) {
        if (output.OutputKey && (
          output.OutputKey.includes('ApiGateway') || 
          output.OutputKey.includes('InvokeUrl') ||
          output.OutputKey.includes('RootUrl') ||
          output.OutputKey.includes('Url')
        ) && output.OutputValue) {
          console.log(`✅ Found API Gateway URL in CloudFormation: ${output.OutputValue}`);
          return output.OutputValue;
        }
      }

      // Method 2: Try to get from API Gateway directly
      console.log('🔍 API Gateway URL not found in CloudFormation outputs.');
      console.log('📋 Checking API Gateway directly...');
      
      const apis = execSync(
        `aws apigateway get-rest-apis --region ${this.region} --output json`,
        { encoding: 'utf8' }
      );
      
      const apisJson = JSON.parse(apis);
      
      for (const api of apisJson.items) {
        if (api.name && api.name.includes('helloworldapi')) {
          const apiId = api.id;
          // Try different stage names
          const possibleStages = ['main', 'dev', 'prod'];
          for (const stage of possibleStages) {
            const apiUrl = `https://${apiId}.execute-api.${this.region}.amazonaws.com/${stage}`;
            console.log(`✅ Found API Gateway URL: ${apiUrl}`);
            return apiUrl;
          }
        }
      }

      throw new Error('Could not find API Gateway URL automatically');

    } catch (error) {
      console.log(`❌ Error extracting API Gateway URL: ${error.message}`);
      throw error;
    }
  }

  async setAmplifyEnvironmentVariable(apiUrl) {
    console.log('🔧 Setting environment variable in Amplify Console...');
    console.log(`App ID: ${this.appId}`);
    console.log(`Environment: ${this.env}`);
    console.log(`API URL: ${apiUrl}`);
    console.log('');

    try {
      // Note: Amplify CLI doesn't directly support setting environment variables for hosting
      // So we'll provide instructions for manual setup
      console.log('ℹ️  Amplify CLI doesn\'t directly support setting hosting environment variables.');
      console.log('📋 Please set the environment variable manually in Amplify Console:');
      console.log('');
      console.log('🔗 Steps to set in Amplify Console:');
      console.log('1. Go to AWS Amplify Console');
      console.log(`2. Select your app (ID: ${this.appId})`);
      console.log('3. Go to App settings → Environment variables');
      console.log('4. Add new variable:');
      console.log(`   Key: REACT_APP_API_URL`);
      console.log(`   Value: ${apiUrl}`);
      console.log('5. Save and redeploy');
      console.log('');

      // Method 2: Try using AWS CLI to update Amplify app
      console.log('📋 Attempting to update via AWS CLI...');
      try {
        // Get current environment variables
        const currentVars = execSync(
          `aws amplify get-app --app-id ${this.appId} --region ${this.region} --output json`,
          { encoding: 'utf8' }
        );
        
        console.log('✅ Successfully connected to Amplify app');
        console.log('📋 You can now set the environment variable in the Amplify Console');
        
      } catch (awsError) {
        console.log(`⚠️  Could not connect to Amplify app: ${awsError.message}`);
        console.log('📋 Please set the environment variable manually in the Amplify Console');
      }

    } catch (error) {
      console.log(`❌ Error setting Amplify environment variable: ${error.message}`);
      console.log('📋 Please set the environment variable manually in the Amplify Console');
    }
  }

  async updateLocalEnvFile(apiUrl) {
    console.log('📝 Updating local .env file...');
    
    try {
      const envContent = `REACT_APP_API_URL=${apiUrl}\n`;
      fs.writeFileSync('.env', envContent);
      console.log('✅ Successfully updated .env file');
    } catch (error) {
      console.log(`❌ Error updating .env file: ${error.message}`);
    }
  }

  async run() {
    console.log('🚀 Starting API Gateway URL setup...');
    console.log('');

    try {
      // Step 1: Extract API Gateway URL
      const apiUrl = await this.getApiGatewayUrl();
      
      // Step 2: Update local .env file
      await this.updateLocalEnvFile(apiUrl);
      
      // Step 3: Set Amplify environment variable
      await this.setAmplifyEnvironmentVariable(apiUrl);
      
      console.log('');
      console.log('🎉 Setup complete!');
      console.log('');
      console.log('📋 Summary:');
      console.log(`✅ API Gateway URL: ${apiUrl}`);
      console.log('✅ Local .env file updated');
      console.log('📋 Amplify Console environment variable needs to be set manually');
      console.log('');
      console.log('🔗 Next steps:');
      console.log('1. Set REACT_APP_API_URL in Amplify Console');
      console.log('2. Redeploy your app');
      console.log('3. Test the API call');
      
    } catch (error) {
      console.log('');
      console.log('❌ Setup failed:', error.message);
      console.log('');
      console.log('📋 Manual fallback:');
      console.log('1. Go to AWS Console → CloudFormation → Find your stack');
      console.log('2. Go to Outputs tab and find the API Gateway URL');
      console.log('3. Set REACT_APP_API_URL in Amplify Console');
    }
  }
}

// Run the setup
const setup = new ApiUrlSetup();
setup.run().catch(console.error); 