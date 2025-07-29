# Robust API Gateway URL Setup Guide

This guide provides automated solutions for extracting API Gateway URLs from existing CloudFormation outputs and setting them as environment variables in Amplify Console.

## 🎯 Overview

The robust setup includes:
1. **Automated CloudFormation Output Extraction** - Gets API Gateway URL from existing CloudFormation stacks
2. **Amplify Console Environment Variable Management** - Sets environment variables automatically
3. **Local Development Support** - Updates local .env files
4. **Error Handling & Fallbacks** - Provides manual instructions when automation fails

## 🚀 Quick Start

### Option 1: Full Automated Setup
```bash
# Run the comprehensive setup script
node setup-api-url.js
```

### Option 2: Amplify Console Only
```bash
# Set environment variable in Amplify Console
node set-amplify-env.js
```

### Option 3: Manual Setup
```bash
# Get API Gateway URL
node get-api-url-aws.js

# Set local environment variable
node set-env.js
```

## 📋 Detailed Process

### 1. CloudFormation Output Extraction

The system automatically extracts API Gateway URLs from existing CloudFormation outputs:

**What it does:**
- Reads your Amplify project configuration
- Queries existing CloudFormation stacks for API Gateway outputs
- Falls back to direct API Gateway queries if needed
- Provides detailed logging and error handling

**Files involved:**
- `setup-api-url.js` - Main extraction script
- `get-api-url-aws.js` - Alternative extraction methods

### 2. Amplify Console Environment Variable Management

Automatically sets environment variables in your Amplify Console:

**What it does:**
- Finds your Amplify app and branch
- Reads current environment variables
- Adds/updates `REACT_APP_API_URL`
- Triggers automatic redeployment

**Files involved:**
- `set-amplify-env.js` - Amplify environment manager
- AWS CLI integration for Amplify Console

### 3. Local Development Support

Updates local .env files for development:

**What it does:**
- Creates/updates `.env` file
- Validates API Gateway URL format
- Provides development environment consistency

## 🔧 How It Works

### CloudFormation Output Detection
The scripts look for API Gateway URLs in CloudFormation outputs with these patterns:
- `ApiGateway*`
- `InvokeUrl*`
- `RootUrl*`
- `*Url*`

### API Gateway Direct Query
If CloudFormation outputs don't contain the URL, the scripts:
- Query API Gateway directly
- Find APIs with names containing 'helloworldapi'
- Try multiple stage names: 'main', 'dev', 'prod'

## 🛠️ Scripts Overview

### `setup-api-url.js`
**Purpose:** Complete end-to-end setup
**Features:**
- Extracts API Gateway URL from existing CloudFormation outputs
- Updates local .env file
- Provides Amplify Console setup instructions
- Comprehensive error handling

### `set-amplify-env.js`
**Purpose:** Amplify Console environment variable management
**Features:**
- Finds Amplify app and branch automatically
- Sets environment variables via AWS CLI
- Triggers automatic redeployment
- Preserves existing environment variables

### `get-api-url-aws.js`
**Purpose:** API Gateway URL extraction only
**Features:**
- Multiple extraction methods (CloudFormation, API Gateway)
- Detailed logging and debugging
- Fallback instructions

### `set-env.js`
**Purpose:** Local environment variable setup
**Features:**
- Interactive URL input
- Format validation
- .env file creation

## 🔍 Troubleshooting

### Common Issues

**1. AWS CLI Not Configured**
```bash
# Configure AWS CLI
aws configure
```

**2. CloudFormation Stack Not Found**
- Verify stack name in `amplify/team-provider-info.json`
- Check AWS region configuration
- Ensure stack is deployed and active

**3. Amplify App Not Found**
- Verify app exists in Amplify Console
- Check AWS region matches app region
- Ensure proper AWS credentials

**4. Environment Variable Not Set**
- Check Amplify Console → App settings → Environment variables
- Verify variable name: `REACT_APP_API_URL`
- Ensure app redeployed after variable change

### Manual Fallback

If automation fails, use manual steps:

1. **Get API Gateway URL:**
   - AWS Console → CloudFormation → Your Stack → Outputs
   - OR AWS Console → API Gateway → Your API → Stages

2. **Set in Amplify Console:**
   - AWS Amplify Console → Your App → App settings → Environment variables
   - Add: `REACT_APP_API_URL = your-api-url`

3. **Update Local .env:**
   ```bash
   echo REACT_APP_API_URL=your-api-url > .env
   ```

## 🔄 Deployment Workflow

### Initial Setup
```bash
# 1. Deploy backend (if not already deployed)
amplify push

# 2. Run robust setup
node setup-api-url.js

# 3. Deploy frontend
git add .
git commit -m "Add robust API URL setup"
git push origin main
```

### Ongoing Development
```bash
# When API Gateway URL changes
node set-amplify-env.js

# When adding new environment variables
# Use Amplify Console or update set-amplify-env.js
```

## 📊 Benefits

### ✅ Automation
- No manual URL copying/pasting
- Consistent across environments
- Reduces human error

### ✅ Robustness
- Multiple extraction methods
- Comprehensive error handling
- Clear fallback instructions

### ✅ Maintainability
- Centralized configuration
- Version-controlled setup
- Easy to update and extend

### ✅ Development Experience
- Local and production consistency
- Clear debugging information
- Automated deployment triggers

## 🎯 Next Steps

1. **Deploy the robust setup** to your repository
2. **Run the setup scripts** to configure your environment
3. **Test the API calls** in both local and deployed environments
4. **Extend the system** for additional environment variables as needed

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review script output for specific error messages
3. Use manual fallback steps if automation fails
4. Verify AWS credentials and permissions 