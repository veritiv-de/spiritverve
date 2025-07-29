const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AmplifyEnvManager {
  constructor() {
    this.teamProviderPath = path.join(__dirname, 'amplify', 'team-provider-info.json');
    this.teamProvider = JSON.parse(fs.readFileSync(this.teamProviderPath, 'utf8'));
    this.env = 'dev';
    this.region = this.teamProvider[this.env].awscloudformation.Region;
  }

  async getAppId() {
    console.log('🔍 Finding Amplify App ID...');
    
    try {
      // List all Amplify apps in the region
      const apps = execSync(
        `aws amplify list-apps --region ${this.region} --output json`,
        { encoding: 'utf8' }
      );
      
      const appsJson = JSON.parse(apps);
      
      // Find the app that matches our project
      for (const app of appsJson.apps) {
        if (app.name && app.name.includes('helloworld')) {
          console.log(`✅ Found Amplify App: ${app.name} (ID: ${app.appId})`);
          return app.appId;
        }
      }
      
      // If not found by name, return the first app (fallback)
      if (appsJson.apps.length > 0) {
        const firstApp = appsJson.apps[0];
        console.log(`⚠️  Using first available app: ${firstApp.name} (ID: ${firstApp.appId})`);
        return firstApp.appId;
      }
      
      throw new Error('No Amplify apps found');
      
    } catch (error) {
      console.log(`❌ Error finding Amplify App ID: ${error.message}`);
      throw error;
    }
  }

  async getBranches(appId) {
    console.log('🔍 Finding Amplify branches...');
    
    try {
      const branches = execSync(
        `aws amplify list-branches --app-id ${appId} --region ${this.region} --output json`,
        { encoding: 'utf8' }
      );
      
      const branchesJson = JSON.parse(branches);
      
      // Find the main branch
      for (const branch of branchesJson.branches) {
        if (branch.branchName === 'main' || branch.branchName === 'master') {
          console.log(`✅ Found main branch: ${branch.branchName}`);
          return branch.branchName;
        }
      }
      
      // Return the first branch if main/master not found
      if (branchesJson.branches.length > 0) {
        const firstBranch = branchesJson.branches[0];
        console.log(`⚠️  Using first available branch: ${firstBranch.branchName}`);
        return firstBranch.branchName;
      }
      
      throw new Error('No branches found');
      
    } catch (error) {
      console.log(`❌ Error finding branches: ${error.message}`);
      throw error;
    }
  }

  async setEnvironmentVariable(appId, branchName, apiUrl) {
    console.log('🔧 Setting environment variable in Amplify Console...');
    console.log(`App ID: ${appId}`);
    console.log(`Branch: ${branchName}`);
    console.log(`API URL: ${apiUrl}`);
    console.log('');

    try {
      // First, get current environment variables
      console.log('📋 Getting current environment variables...');
      const currentEnv = execSync(
        `aws amplify get-branch --app-id ${appId} --branch-name ${branchName} --region ${this.region} --output json`,
        { encoding: 'utf8' }
      );
      
      const currentEnvJson = JSON.parse(currentEnv);
      const currentVars = currentEnvJson.branch.environmentVariables || {};
      
      console.log('📋 Current environment variables:', currentVars);
      
      // Add our new variable
      const updatedVars = {
        ...currentVars,
        REACT_APP_API_URL: apiUrl
      };
      
      console.log('📋 Updated environment variables:', updatedVars);
      
      // Update the branch with new environment variables
      console.log('📋 Updating branch with new environment variables...');
      execSync(
        `aws amplify update-branch --app-id ${appId} --branch-name ${branchName} --environment-variables '${JSON.stringify(updatedVars)}' --region ${this.region} --output json`,
        { encoding: 'utf8' }
      );
      
      console.log('✅ Successfully updated environment variables!');
      console.log('');
      console.log('🔄 The app will automatically redeploy with the new environment variables.');
      
    } catch (error) {
      console.log(`❌ Error setting environment variable: ${error.message}`);
      console.log('');
      console.log('📋 Manual fallback:');
      console.log('1. Go to AWS Amplify Console');
      console.log(`2. Select your app (ID: ${appId})`);
      console.log(`3. Go to branch: ${branchName}`);
      console.log('4. Go to App settings → Environment variables');
      console.log('5. Add: REACT_APP_API_URL = ' + apiUrl);
      console.log('6. Save and redeploy');
    }
  }

  async run() {
    console.log('🚀 Starting Amplify Environment Variable Setup...');
    console.log('');

    try {
      // Step 1: Get Amplify App ID
      const appId = await this.getAppId();
      
      // Step 2: Get branch name
      const branchName = await this.getBranches(appId);
      
      // Step 3: Get API Gateway URL from .env file
      console.log('📋 Reading API Gateway URL from .env file...');
      const envContent = fs.readFileSync('.env', 'utf8');
      const apiUrlMatch = envContent.match(/REACT_APP_API_URL=(.+)/);
      
      if (!apiUrlMatch) {
        throw new Error('REACT_APP_API_URL not found in .env file');
      }
      
      const apiUrl = apiUrlMatch[1].trim();
      console.log(`✅ Found API Gateway URL: ${apiUrl}`);
      
      // Step 4: Set environment variable in Amplify
      await this.setEnvironmentVariable(appId, branchName, apiUrl);
      
      console.log('');
      console.log('🎉 Setup complete!');
      console.log('');
      console.log('📋 Summary:');
      console.log(`✅ Amplify App ID: ${appId}`);
      console.log(`✅ Branch: ${branchName}`);
      console.log(`✅ API Gateway URL: ${apiUrl}`);
      console.log('✅ Environment variable set in Amplify Console');
      console.log('');
      console.log('🔗 Next steps:');
      console.log('1. Wait for the automatic redeployment to complete');
      console.log('2. Test your API call in the deployed app');
      
    } catch (error) {
      console.log('');
      console.log('❌ Setup failed:', error.message);
      console.log('');
      console.log('📋 Manual fallback:');
      console.log('1. Go to AWS Amplify Console');
      console.log('2. Find your app and branch');
      console.log('3. Go to App settings → Environment variables');
      console.log('4. Add REACT_APP_API_URL with your API Gateway URL');
    }
  }
}

// Run the setup
const manager = new AmplifyEnvManager();
manager.run().catch(console.error); 