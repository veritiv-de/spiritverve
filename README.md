# HelloWorld Amplify Full Stack App

🎯 **Goal**: A minimal full-stack web application using Node.js and React, hosted via AWS Amplify. The application displays "Hello World" on a frontend web page and confirms backend API connectivity by fetching the same string from a Node.js-powered API endpoint.

## 🧱 Architecture Overview

- **Frontend**: React (SPA)
- **Backend**: Node.js Lambda Function
- **Hosting**: AWS Amplify
- **API**: API Gateway with Lambda integration
- **Deployment**: Continuous Deployment via Amplify Console
- **Configuration**: Robust API Gateway URL management

## 🛠️ Technology Stack

| Layer | Tool / Framework |
|-------|------------------|
| Frontend | React |
| Backend | Node.js (Lambda) |
| Hosting | AWS Amplify |
| Deployment | Amplify Console CI/CD |
| API Routing | API Gateway + Lambda |
| Configuration | Automated CloudFormation output extraction |
| Data | None (static string only) |
| Source Control | Git |

## ✅ Features

### Frontend
- React app with a single page
- Displays: "Hello from the frontend!"
- Button to call backend API and display returned message
- Error handling and loading states
- Responsive design with modern styling
- Robust API URL configuration with fallbacks

### Backend
- API endpoint: `/hello`
- Returns JSON: `{ message: "Hello from the backend!" }`
- Node.js Lambda function deployed via Amplify
- CORS configured for frontend-backend communication
- Proper error handling and logging

### Configuration Management
- **Automated API Gateway URL extraction** from CloudFormation outputs
- **Amplify Console environment variable management** via AWS CLI
- **Local development support** with .env file management
- **Multiple fallback methods** for URL discovery
- **Comprehensive error handling** and debugging

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or later)
- AWS CLI configured
- Amplify CLI installed globally: `npm install -g @aws-amplify/cli`

### Local Development

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd helloworld-amplify-app
   npm install
   ```

2. **Set up API Gateway URL** (choose one option):
   
   **Option A: Automated Setup (requires AWS CLI)**
   ```bash
   node setup-api-url.js
   ```
   
   **Option B: Manual Setup**
   ```bash
   node set-env.js
   # Enter your API Gateway URL when prompted
   ```

3. **Run locally**:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 🚀 AWS Amplify Deployment

### Option 1: Amplify CLI (Recommended)

1. **Initialize Amplify project**:
   ```bash
   amplify init
   ```
   - Project name: `helloworldapp`
   - Environment: `dev`
   - Default editor: Your preferred editor
   - App type: `javascript`
   - Framework: `react`
   - Source directory: `src`
   - Build directory: `build`
   - Build command: `npm run build`
   - Start command: `npm start`

2. **Deploy backend resources**:
   ```bash
   amplify push
   ```
   This will create:
   - Lambda function for the API
   - API Gateway with `/hello` endpoint
   - IAM roles and policies

3. **Set up API Gateway URL**:
   ```bash
   # Extract API Gateway URL and set environment variables
   node setup-api-url.js
   ```

4. **Add hosting**:
   ```bash
   amplify add hosting
   ```
   - Select: `Amazon CloudFront and S3`
   - Follow the prompts

5. **Deploy frontend**:
   ```bash
   amplify publish
   ```

### Option 2: Amplify Console (Git-based)

1. **Push code to Git repository** (GitHub, GitLab, etc.)

2. **Connect to Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository
   - Select the branch (usually `main` or `master`)

3. **Configure build settings**:
   - The `amplify.yml` file is already configured
   - Amplify will automatically detect the React app

4. **Set environment variables**:
   - Go to App settings → Environment variables
   - Add: `REACT_APP_API_URL = your-api-gateway-url`
   - You can get the URL using: `node get-api-url-aws.js`

5. **Deploy**:
   - Click "Save and deploy"
   - Wait for the build to complete

## 📁 Project Structure

```
helloworld-amplify-app/
├── amplify/
│   ├── backend/
│   │   ├── api/
│   │   │   └── helloworldapi/
│   │   │       ├── helloworldapi-cloudformation-template.json
│   │   │       └── parameters.json
│   │   ├── function/
│   │   │   └── helloWorld/
│   │   │       ├── src/
│   │   │       │   ├── index.js
│   │   │       │   └── package.json
│   │   │       ├── helloWorld-cloudformation-template.json
│   │   │       └── function-parameters.json
│   │   └── backend-config.json
│   └── team-provider-info.json
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── amplify.yml
├── package.json
├── .env (created by setup scripts)
├── setup-api-url.js (robust API URL setup)
├── set-amplify-env.js (Amplify environment management)
├── get-api-url-aws.js (API URL extraction)
├── set-env.js (local environment setup)
├── test-api.js (API testing)
└── README.md
```

## 🔧 Configuration

### Environment Variables

The application uses `REACT_APP_API_URL` to connect to the backend API. This can be set in several ways:

**Local Development:**
```bash
# Create .env file
echo REACT_APP_API_URL=https://your-api-id.execute-api.region.amazonaws.com/main > .env
```

**Amplify Console:**
- Go to App settings → Environment variables
- Add: `REACT_APP_API_URL = your-api-gateway-url`

**Automated Setup:**
```bash
# Full automated setup (requires AWS CLI)
node setup-api-url.js

# Amplify Console only
node set-amplify-env.js
```

### API Endpoint

After deployment, your API will be available at:
```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/hello
```

## 🛠️ Robust Setup Scripts

### `setup-api-url.js`
Complete end-to-end setup that:
- Extracts API Gateway URL from CloudFormation outputs
- Updates local .env file
- Provides Amplify Console setup instructions
- Includes comprehensive error handling

### `set-amplify-env.js`
Amplify Console environment variable management:
- Finds your Amplify app and branch automatically
- Sets environment variables via AWS CLI
- Triggers automatic redeployment
- Preserves existing environment variables

### `get-api-url-aws.js`
API Gateway URL extraction:
- Multiple extraction methods (CloudFormation, API Gateway)
- Detailed logging and debugging
- Fallback instructions

### `set-env.js`
Local environment variable setup:
- Interactive URL input
- Format validation
- .env file creation

### `test-api.js`
API endpoint testing:
- Tests the API Gateway endpoint directly
- Validates CORS configuration
- Shows response details

## 🧪 Testing

### Test the Frontend
1. Open the deployed app URL
2. Verify "Hello from the frontend!" is displayed
3. Click "Call Backend API" button
4. Verify "Hello from the backend!" appears

### Test the API Directly
```bash
# Using the test script
node test-api.js

# Or using curl
curl https://your-api-id.execute-api.region.amazonaws.com/main/hello
```

Expected response:
```json
{
  "message": "Hello from the backend!",
  "timestamp": "2025-01-XX...",
  "requestId": "..."
}
```

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to fetch" Error**:
   - Check that `REACT_APP_API_URL` is set correctly
   - Verify the API Gateway URL is accessible
   - Use `node test-api.js` to test the endpoint directly

2. **Environment Variable Not Set**:
   - For local development: Check `.env` file exists
   - For Amplify: Go to App settings → Environment variables
   - Use `node setup-api-url.js` for automated setup

3. **CORS Errors**:
   - Ensure the Lambda function includes proper CORS headers
   - Check that OPTIONS method is handled

4. **API Not Found**:
   - Verify the API Gateway deployment
   - Check the correct endpoint URL
   - Use `node get-api-url-aws.js` to find the correct URL

5. **Build Failures**:
   - Ensure Node.js version compatibility
   - Check `amplify.yml` configuration

### Useful Commands

```bash
# Check Amplify status
amplify status

# View logs
amplify console api

# Update backend
amplify push

# Delete resources
amplify delete

# Test API endpoint
node test-api.js

# Get API Gateway URL
node get-api-url-aws.js

# Set up environment variables
node setup-api-url.js
```

## 📊 Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │   API Gateway    │    │ Lambda Function │
│  (Frontend)     │───▶│                  │───▶│   (Backend)     │
│                 │    │  /hello endpoint │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   CloudWatch     │    │   CloudWatch    │
│      + S3       │    │     Logs         │    │     Logs        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔒 Security

- Default Amplify IAM roles provide minimal required permissions
- API Gateway configured with CORS for web access
- No authentication required for this demo (public endpoint)

## 📝 Next Steps

To extend this application:

1. **Add Authentication**: Use Amplify Auth for user management
2. **Add Database**: Integrate DynamoDB for data persistence
3. **Add More Endpoints**: Expand the API with additional routes
4. **Add Testing**: Implement unit and integration tests
5. **Add Monitoring**: Set up CloudWatch dashboards and alarms
6. **Add CI/CD**: Enhance deployment pipeline with testing

## 📚 Additional Documentation

- **Robust Setup Guide**: See `ROBUST-SETUP.md` for detailed configuration management
- **Deployment Guide**: See `DEPLOYMENT.md` for step-by-step deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.