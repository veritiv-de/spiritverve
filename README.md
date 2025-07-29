# SpiritVerve - AWS Amplify Full Stack App with Redshift Integration

🎯 **Goal**: A full-stack web application using Node.js and React, hosted via AWS Amplify, featuring both basic API connectivity and advanced Redshift data querying capabilities with beautiful data visualization.

## 🧱 Architecture Overview

- **Frontend**: React (SPA) with enhanced data table formatting
- **Backend**: Node.js Lambda Function with Redshift connectivity
- **Database**: Amazon Redshift for data warehousing
- **Hosting**: AWS Amplify
- **API**: API Gateway with Lambda integration
- **Deployment**: Continuous Deployment via Amplify Console
- **Configuration**: Robust API Gateway URL management
- **Networking**: VPC configuration for Lambda-Redshift connectivity

## 🛠️ Technology Stack

| Layer | Tool / Framework |
|-------|------------------|
| Frontend | React with enhanced CSS styling |
| Backend | Node.js (Lambda) |
| Database | Amazon Redshift |
| Hosting | AWS Amplify |
| Deployment | Amplify Console CI/CD |
| API Routing | API Gateway + Lambda |
| Configuration | Automated CloudFormation output extraction |
| Data Visualization | Custom React components with responsive tables |
| Source Control | Git |

## ✅ Features

### Frontend
- React app with modern, responsive design
- Displays: "Hello from the frontend!" message
- **Enhanced Redshift data table** with beautiful formatting
- **Summary statistics grid** showing query metrics
- **Smart data type detection** and formatting (numbers, dates, booleans)
- Button to call backend API and display returned message
- **Redshift query button** with loading states and error handling
- Error handling and loading states for all operations
- Responsive design with modern styling
- Robust API URL configuration with fallbacks

### Backend
- **Two API endpoints**: `/hello` and `/redshift`
- `/hello` returns JSON: `{ message: "Hello from the backend!" }`
- **`/redshift` executes queries** and returns formatted data
- Node.js Lambda function deployed via Amplify
- **VPC configuration** for Redshift connectivity
- **Environment variable support** for Redshift credentials
- CORS configured for frontend-backend communication
- Proper error handling and logging
- **Connection timeout handling** and retry logic

### Database Integration
- **Amazon Redshift connectivity** via Lambda function
- **Secure VPC configuration** with proper security groups
- **Environment-based configuration** for Redshift credentials
- **Query execution** with result formatting
- **Error handling** for connection and authentication issues
- **Debug information** for troubleshooting

### Configuration Management
- **Automated API Gateway URL extraction** from CloudFormation outputs
- **Amplify Console environment variable management** via AWS CLI
- **Local development support** with .env file management
- **Multiple fallback methods** for URL discovery
- **Comprehensive error handling** and debugging
- **Redshift credential management** via environment variables

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
spiritverve/
├── amplify/
│   ├── backend/
│   │   ├── api/
│   │   │   └── helloworldapi/
│   │   │       ├── helloworldapi-cloudformation-template.json
│   │   │       └── parameters.json
│   │   ├── function/
│   │   │   └── helloWorld/
│   │   │       ├── src/
│   │   │       │   ├── index.js (updated with Redshift logic)
│   │   │       │   └── package.json
│   │   │       ├── helloWorld-cloudformation-template.json
│   │   │       └── function-parameters.json
│   │   └── backend-config.json
│   └── team-provider-info.json
├── public/
│   └── index.html
├── src/
│   ├── App.js (enhanced with Redshift query UI)
│   ├── App.css (enhanced table styling)
│   └── index.js
├── amplify.yml
├── package.json
├── .env (created by setup scripts)
├── setup-api-url.js (robust API URL setup)
├── set-amplify-env.js (Amplify environment management)
├── get-api-url-aws.js (API URL extraction)
├── set-env.js (local environment setup)
├── test-api.js (API testing)
├── test-redshift-endpoint.js (Redshift endpoint testing)
├── test-redshift-password.js (Redshift password testing)
└── README.md
```

## 🔧 Configuration

### Environment Variables

The application uses several environment variables for configuration:

#### API Gateway URL
**Variable**: `REACT_APP_API_URL`
**Purpose**: Connect frontend to backend API
**Format**: `https://your-api-id.execute-api.region.amazonaws.com/main`

#### Redshift Configuration (Lambda Environment Variables)
**Variables**:
- `REDSHIFT_HOST` - Redshift cluster endpoint
- `REDSHIFT_PORT` - Redshift port (default: 5439)
- `REDSHIFT_DATABASE` - Database name
- `REDSHIFT_USER` - Username for Redshift
- `REDSHIFT_PASSWORD` - Password for Redshift user
- `REDSHIFT_SSL` - SSL connection (default: true)

**Example Lambda Environment Variables**:
```
REDSHIFT_HOST=dev-redshift-instance.cbgfkhkxtpk8.us-east-1.redshift.amazonaws.com
REDSHIFT_PORT=5439
REDSHIFT_DATABASE=veritiv
REDSHIFT_USER=hackathon
REDSHIFT_PASSWORD=your-secure-password
REDSHIFT_SSL=true
```

### Setting Environment Variables

**Local Development:**
```bash
# Create .env file
echo REACT_APP_API_URL=https://your-api-id.execute-api.region.amazonaws.com/main > .env
```

**Amplify Console:**
- Go to App settings → Environment variables
- Add: `REACT_APP_API_URL = your-api-gateway-url`

**Lambda Function (Redshift credentials):**
- Go to AWS Lambda Console
- Select your function (`helloWorld-main`)
- Go to Configuration → Environment variables
- Add the Redshift configuration variables

**Automated Setup:**
```bash
# Full automated setup (requires AWS CLI)
node setup-api-url.js

# Amplify Console only
node set-amplify-env.js
```

### API Endpoints

After deployment, your API will be available at:
```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/hello
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/redshift
```

### VPC Configuration

The Lambda function is configured with VPC settings for Redshift connectivity:
- **Security Group**: `sg-045e23d0687f76c74`
- **Subnets**: `subnet-0e0626912b145dd06`, `subnet-0f02991a028412e8e`
- **Outbound Rules**: Must allow port 5439 to Redshift cluster

## 🧪 Testing

### Test the Frontend
1. Open the deployed app URL
2. Verify "Hello from the frontend!" is displayed
3. Click "Call Backend API" button
4. Verify "Hello from the backend!" appears
5. **Click "Query Redshift" button**
6. **Verify Redshift data is displayed in formatted table**

### Test the API Directly
```bash
# Test hello endpoint
node test-api.js

# Test Redshift endpoint
node test-redshift-endpoint.js

# Or using curl
curl https://your-api-id.execute-api.region.amazonaws.com/main/hello
curl https://your-api-id.execute-api.region.amazonaws.com/main/redshift
```

### Test Redshift Connectivity
```bash
# Test Redshift password (if authentication issues)
node test-redshift-password.js
```

### Expected Responses

**Hello Endpoint:**
```json
{
  "message": "Hello from the backend!",
  "timestamp": "2025-01-XX...",
  "requestId": "..."
}
```

**Redshift Endpoint:**
```json
{
  "message": "Redshift query executed successfully!",
  "timestamp": "2025-01-XX...",
  "requestId": "...",
  "rowCount": 10,
  "columns": ["column1", "column2", ...],
  "data": [
    {"column1": "value1", "column2": "value2", ...},
    ...
  ],
  "debug": {
    "connectionHost": "dev-redshift-instance.cbgfkhkxtpk8.us-east-1.redshift.amazonaws.com",
    "connectionPort": 5439,
    "database": "veritiv",
    "user": "hackathon"
  }
}
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

### `test-redshift-endpoint.js`
Redshift endpoint testing:
- Tests the `/redshift` endpoint specifically
- Validates Redshift query execution
- Shows detailed response and error information

### `test-redshift-password.js`
Redshift password testing:
- Tests common passwords for Redshift authentication
- Helps troubleshoot connection issues
- Provides debugging information for credential problems

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

6. **Redshift Connection Timeout**:
   - Verify VPC security group outbound rules allow port 5439
   - Check Redshift cluster is accessible from Lambda VPC
   - Verify Redshift security group allows inbound from Lambda security group
   - Use `node test-redshift-password.js` to test credentials

7. **Redshift Authentication Failed**:
   - Check Redshift user credentials in Lambda environment variables
   - Verify user has proper permissions on the database
   - Use `node test-redshift-password.js` to test different passwords
   - Reset Redshift user password if needed

8. **Redshift Query Errors**:
   - Check table and schema names are correct
   - Verify user has SELECT permissions on the table
   - Review Lambda CloudWatch logs for detailed error messages

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

# Test API endpoints
node test-api.js
node test-redshift-endpoint.js

# Test Redshift connectivity
node test-redshift-password.js

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
│ • Enhanced UI   │    │  /redshift       │    │ • VPC Config    │
│ • Data Tables   │    │                  │    │ • Redshift Conn │
│ • Summary Stats │    │                  │    │ • Error Handling│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   CloudWatch     │    │   Amazon        │
│      + S3       │    │     Logs         │    │   Redshift      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   VPC Security   │    │   Data          │
                       │     Groups       │    │   Warehouse     │
                       └──────────────────┘    └─────────────────┘
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