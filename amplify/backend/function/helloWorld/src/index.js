/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { Client } = require('pg');

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

    // Handle GET request to /redshift endpoint
    if (event.httpMethod === 'GET' && event.path === '/redshift') {
        try {
            // Redshift connection configuration
            const client = new Client({
                host: 'dev-redshift-instance.cbgfkhkxtpk8.us-east-1.redshift.amazonaws.com',
                port: 5439,
                database: 'veritiv',
                user: 'hackathon',
                password: 'dedevAI25!',
                ssl: true
            });

            console.log('Connecting to Redshift...');
            await client.connect();
            console.log('Connected to Redshift successfully');

            // Execute the query
            const query = 'SELECT * FROM edm.f_inv LIMIT 10;';
            console.log('Executing query:', query);
            
            const result = await client.query(query);
            console.log('Query executed successfully, rows returned:', result.rows.length);

            await client.end();
            console.log('Redshift connection closed');

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: 'Redshift query executed successfully!',
                    timestamp: new Date().toISOString(),
                    requestId: event.requestContext?.requestId || 'unknown',
                    rowCount: result.rows.length,
                    data: result.rows
                })
            };

        } catch (error) {
            console.error('Error connecting to Redshift:', error);
            
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database Error',
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    requestId: event.requestContext?.requestId || 'unknown'
                })
            };
        }
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