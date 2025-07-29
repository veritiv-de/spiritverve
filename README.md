# HelloWorld Amplify Full Stack App

🎯 **Goal**: A minimal full-stack web application using Node.js and React, hosted via AWS Amplify. The application displays "Hello World" on a frontend web page and confirms backend API connectivity by fetching the same string from a Node.js-powered API endpoint.

## 🧱 Architecture Overview

- **Frontend**: React (SPA)
- **Backend**: Node.js Lambda Function
- **Hosting**: AWS Amplify
- **API**: API Gateway with Lambda integration
- **Deployment**: Continuous Deployment via Amplify Console

## 🛠️ Technology Stack

| Layer | Tool / Framework |
|-------|------------------|
| Frontend | React |
| Backend | Node.js (Lambda) |
| Hosting | AWS Amplify |
| Deployment | Amplify Console CI/CD |
| API Routing | API Gateway + Lambda |
| Data | None (static string only) |
| Source Control | Git |

## ✅ Features

### Frontend
- React app with a single page
- Displays: "Hello from the frontend!"
- Button to call backend API and display returned message
- Error handling and loading states
- Responsive design with modern styling

### Backend
- API endpoint: `/hello`
- Returns JSON: `{ message: "Hello from the backend!" }`
- Node.js Lambda function deployed via Amplify
- CORS configured for frontend-backend communication
- Proper error handling and logging

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

2. **Run locally**:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`###
 AWS Amplify Deployment

#### Option 1: Amplify CLI (Recommended)

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

3. **Add hosting**:
   ```bash
   amplify add hosting
   ```
   - Select: `Amazon CloudFront and S3`
   - Follow the prompts

4. **Deploy frontend**:
   ```bash
   amplify publish
   ```

#### Option 2: Amplify Console (Git-based)

1. **Push code to Git repository** (GitHub, GitLab, etc.)

2. **Connect to Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository
   - Select the branch (usually `main` or `master`)

3. **Configure build settings**:
   - The `amplify.yml` file is already configured
   - Amplify will automatically detect the React app

4. **Deploy**:
   - Click "Save and deploy"
   - Wait for the build to complete#
# 📁 Project Structure

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
└── README.md
```

## 🔧 Configuration

### Environment Variables

For local development, you can create a `.env` file:
```
REACT_APP_API_URL=https://your-api-id.execute-api.region.amazonaws.com/dev
```

### API Endpoint

After deployment, your API will be available at:
```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/hello
```

## 🧪 Testing

### Test the Frontend
1. Open the deployed app URL
2. Verify "Hello from the frontend!" is displayed
3. Click "Call Backend API" button
4. Verify "Hello from the backend!" appears

### Test the API Directly
```bash
curl https://your-api-id.execute-api.region.amazonaws.com/dev/hello
```

Expected response:
```json
{
  "message": "Hello from the backend!",
  "timestamp": "2025-01-XX...",
  "requestId": "..."
}
```## 🔍 Tro
ubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure the Lambda function includes proper CORS headers
   - Check that OPTIONS method is handled

2. **API Not Found**:
   - Verify the API Gateway deployment
   - Check the correct endpoint URL

3. **Build Failures**:
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.