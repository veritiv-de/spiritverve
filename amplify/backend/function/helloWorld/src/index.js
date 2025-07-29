/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    // Set CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({})
        };
    }

    // Handle GET request to /hello endpoint
    if (event.httpMethod === 'GET' && event.path === '/hello') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Hello from the backend!',
                timestamp: new Date().toISOString(),
                requestId: event.requestContext?.requestId || 'unknown'
            })
        };
    }

    // Handle other requests
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
            error: 'Not Found',
            message: 'The requested endpoint was not found'
        })
    };
};