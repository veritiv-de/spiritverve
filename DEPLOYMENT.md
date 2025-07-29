# AWS Amplify Deployment Guide

This guide provides step-by-step instructions for deploying the HelloWorld Amplify Full Stack App to AWS.

## Prerequisites

Before deploying, ensure you have:

- **AWS Account**: Active AWS account with appropriate permissions
- **AWS CLI**: Installed and configured with your credentials
- **Amplify CLI**: Installed globally (`npm install -g @aws-amplify/cli`)
- **Node.js**: Version 18 or later
- **Git**: For version control (if using Console deployment)

## Setup AWS CLI

If you haven't configured AWS CLI yet:

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format (e.g., `json`)

## Setup Amplify CLI

Configure Amplify CLI with your AWS account:

```bash
amplify configure
```

Follow the prompts to:
1. Sign in to AWS Console
2. Create an IAM user for Amplify
3. Set up access keys

## Deployment Methods

### Method 1: Amplify CLI (Recommended)

#### Step 1: Initialize Amplify Project

```bash
amplify init
```

**Configuration Options:**
- Project name: `helloworldapp`
- Environment name: `dev`
- Default editor: `Visual Studio Code` (or your preference)
- App type: `javascript`
- JavaScript framework: `react`
- Source Directory Path: `src`
- Distribution Directory Path: `build`
- Build Command: `npm run build`
- Start Command: `npm start`
- AWS Profile: Use default or select your profile

#### Step 2: Add API (Backend)

```bash
amplify add api
```

**Configuration:**
- Service: `REST`
- API name: `helloworldapi`
- Path: `/hello`
- Lambda source: `Create a new Lambda function`
- Function name: `helloWorld`
- Template: `Hello World`
- Advanced settings: `No`

#### Step 3: Add Hosting

```bash
amplify add hosting
```

**Configuration:**
- Service: `Amazon CloudFront and S3`
- Hosting bucket name: Accept default
- Index doc: `index.html`
- Error doc: `index.html`

#### Step 4: Deploy Backend

```bash
amplify push
```

This will:
- Create CloudFormation stacks
- Deploy Lambda function
- Set up API Gateway
- Configure IAM roles

**Expected Output:**
```
✔ Successfully pulled backend environment dev from the cloud.
✔ All resources are updated in the cloud

REST API endpoint: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
```

#### Step 5: Update Frontend Configuration

After deployment, update your React app to use the actual API endpoint:

1. Note the API endpoint from the previous step
2. Create a `.env` file in your project root:

```bash
echo "REACT_APP_API_URL=https://your-api-id.execute-api.region.amazonaws.com/dev" > .env
```

#### Step 6: Deploy Frontend

```bash
amplify publish
```

This will:
- Build the React app
- Upload to S3
- Configure CloudFront distribution
- Provide the live URL

### Method 2: Amplify Console (Git-based)

#### Step 1: Push to Git Repository

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: HelloWorld Amplify App"
```

2. Push to your Git provider (GitHub, GitLab, Bitbucket):
```bash
git remote add origin https://github.com/yourusername/helloworld-amplify-app.git
git push -u origin main
```

#### Step 2: Connect to Amplify Console

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Select your Git provider
4. Authorize AWS Amplify to access your repositories
5. Select your repository and branch

#### Step 3: Configure Build Settings

The `amplify.yml` file is already configured, but verify these settings:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - '# Execute Amplify CLI with the helper script'
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Step 4: Configure Environment Variables

In the Amplify Console:
1. Go to **App settings** → **Environment variables**
2. Add any required environment variables
3. For production, you might want to add:
   - `NODE_ENV=production`
   - `REACT_APP_API_URL` (will be auto-configured by Amplify)

#### Step 5: Deploy

1. Click **"Save and deploy"**
2. Monitor the build process in real-time
3. Wait for deployment to complete (usually 5-10 minutes)

## Post-Deployment Verification

### Test the Application

1. **Frontend Test**:
   - Open the provided Amplify URL
   - Verify "Hello from the frontend!" is displayed
   - Check that the UI loads correctly

2. **Backend Test**:
   - Click the "Call Backend API" button
   - Verify "Hello from the backend!" appears
   - Check browser console for any errors

3. **Direct API Test**:
```bash
curl https://your-api-id.execute-api.region.amazonaws.com/dev/hello
```

Expected response:
```json
{
  "message": "Hello from the backend!",
  "timestamp": "2025-01-28T...",
  "requestId": "..."
}
```

### Monitor Resources

Check these AWS services in the console:
- **Lambda**: Verify function is created and has recent invocations
- **API Gateway**: Check the REST API and test endpoints
- **CloudFront**: Verify distribution is deployed
- **S3**: Check hosting bucket has your files
- **IAM**: Review created roles and policies

## Useful Commands

### Amplify CLI Commands

```bash
# Check current status
amplify status

# View backend resources
amplify console

# View API logs
amplify console api

# Update backend only
amplify push

# Update frontend and backend
amplify publish

# Pull latest backend config
amplify pull

# Delete all resources
amplify delete
```

### AWS CLI Commands

```bash
# List Lambda functions
aws lambda list-functions --query 'Functions[?contains(FunctionName, `helloWorld`)]'

# List API Gateway APIs
aws apigateway get-rest-apis --query 'items[?contains(name, `helloworld`)]'

# Check CloudFormation stacks
aws cloudformation list-stacks --query 'StackSummaries[?contains(StackName, `amplify`)]'
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptoms**: Browser console shows CORS policy errors
**Solution**: 
- Verify Lambda function includes CORS headers
- Check API Gateway CORS configuration
- Ensure OPTIONS method is properly handled

#### 2. API Gateway 403/404 Errors
**Symptoms**: API calls return 403 Forbidden or 404 Not Found
**Solution**:
- Verify API Gateway deployment
- Check resource paths and methods
- Confirm Lambda permissions

#### 3. Build Failures
**Symptoms**: Amplify build fails during deployment
**Solution**:
- Check Node.js version compatibility
- Verify `amplify.yml` configuration
- Review build logs in Amplify Console

#### 4. Lambda Function Errors
**Symptoms**: 500 Internal Server Error from API
**Solution**:
- Check CloudWatch logs for the Lambda function
- Verify function code and dependencies
- Test function directly in Lambda console

### Getting Help

1. **CloudWatch Logs**: Check logs for Lambda functions and API Gateway
2. **Amplify Console**: Review build logs and deployment status
3. **AWS Support**: Use AWS Support Center for account-specific issues
4. **Community**: AWS Amplify GitHub repository and Stack Overflow

## Cleanup

To avoid ongoing charges, delete resources when done:

```bash
# Delete all Amplify resources
amplify delete

# Or delete from Console
# Go to Amplify Console → Select App → Actions → Delete app
```

This will remove:
- Lambda functions
- API Gateway
- S3 buckets
- CloudFront distributions
- IAM roles and policies
- CloudFormation stacks

## Cost Estimation

**Free Tier Eligible Resources:**
- Lambda: 1M requests/month free
- API Gateway: 1M API calls/month free
- S3: 5GB storage free
- CloudFront: 50GB data transfer free

**Estimated Monthly Cost (beyond free tier):**
- Lambda: ~$0.20 per 1M requests
- API Gateway: ~$3.50 per 1M requests
- S3: ~$0.023 per GB
- CloudFront: ~$0.085 per GB

For a simple demo app, costs should remain within the free tier limits.