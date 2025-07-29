/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { Client } = require('pg');

exports.handler = async (event) => {
    console.log(`=== LAMBDA FUNCTION STARTED ===`);
    // Force deployment - 2025-07-29T16:33:06.413Z
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`HTTP Method: ${event.httpMethod}`);
    console.log(`Path: ${event.path}`);
    console.log(`Request ID: ${event.requestContext?.requestId || 'unknown'}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('');
    
    // Set CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        console.log('Handling OPTIONS request');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({})
        };
    }

    // Handle GET request to /hello endpoint
    if (event.httpMethod === 'GET' && event.path === '/hello') {
        console.log('Handling /hello endpoint');
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
        console.log('=== REDSHIFT QUERY STARTED ===');
        
        try {
            // Log connection details (without password)
            const connectionConfig = {
                host: 'dev-redshift-instance.cbgfkhkxtpk8.us-east-1.redshift.amazonaws.com',
                port: 5439,
                database: 'veritiv',
                user: 'hackathon',
                ssl: true
            };
            
            console.log('Redshift connection config:', JSON.stringify(connectionConfig, null, 2));
            console.log('Attempting to connect to Redshift...');

            // Redshift connection configuration
            const client = new Client({
                host: 'dev-redshift-instance.cbgfkhkxtpk8.us-east-1.redshift.amazonaws.com',
                port: 5439,
                database: 'veritiv',
                user: 'hackathon',
                password: 'dedevAI25!',
                ssl: true
            });

            console.log('Client created, attempting connection...');
            await client.connect();
            console.log('✅ Successfully connected to Redshift!');

            // Execute the query
            const query = 'SELECT * FROM edm.f_inv LIMIT 10;';
            console.log('Executing query:', query);
            
            const result = await client.query(query);
            console.log(`✅ Query executed successfully!`);
            console.log(`Rows returned: ${result.rows.length}`);
            console.log(`Column names: ${result.fields.map(f => f.name).join(', ')}`);
            
            if (result.rows.length > 0) {
                console.log('Sample row data:', JSON.stringify(result.rows[0], null, 2));
            }

            await client.end();
            console.log('✅ Redshift connection closed successfully');

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: 'Redshift query executed successfully!',
                    timestamp: new Date().toISOString(),
                    requestId: event.requestContext?.requestId || 'unknown',
                    rowCount: result.rows.length,
                    columns: result.fields.map(f => f.name),
                    data: result.rows,
                    debug: {
                        connectionHost: connectionConfig.host,
                        connectionPort: connectionConfig.port,
                        database: connectionConfig.database,
                        user: connectionConfig.user
                    }
                })
            };

        } catch (error) {
            console.error('=== REDSHIFT ERROR DETAILS ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Error code:', error.code);
            console.error('Error detail:', error.detail);
            console.error('Error hint:', error.hint);
            console.error('Error where:', error.where);
            console.error('Error schema:', error.schema);
            console.error('Error table:', error.table);
            console.error('Error column:', error.column);
            console.error('Error dataType:', error.dataType);
            console.error('Error constraint:', error.constraint);
            console.error('Error file:', error.file);
            console.error('Error line:', error.line);
            console.error('Error routine:', error.routine);
            
            // Determine error type and provide specific guidance
            let errorType = 'Unknown Error';
            let userMessage = error.message;
            let debugInfo = {};
            
            if (error.code === 'ECONNREFUSED') {
                errorType = 'Connection Refused';
                userMessage = 'Cannot connect to Redshift. Check if the cluster is running and accessible from this VPC.';
                debugInfo = { 
                    suggestion: 'Verify VPC configuration, security groups, and cluster status',
                    code: error.code 
                };
            } else if (error.code === 'ENOTFOUND') {
                errorType = 'Host Not Found';
                userMessage = 'Redshift host not found. Check the hostname and DNS resolution.';
                debugInfo = { 
                    suggestion: 'Verify the Redshift endpoint URL is correct',
                    code: error.code 
                };
            } else if (error.code === 'ETIMEDOUT') {
                errorType = 'Connection Timeout';
                userMessage = 'Connection to Redshift timed out. Check network connectivity and security groups.';
                debugInfo = { 
                    suggestion: 'Verify security groups allow Lambda to connect to Redshift on port 5439',
                    code: error.code 
                };
            } else if (error.code === '28P01') {
                errorType = 'Authentication Failed';
                userMessage = 'Invalid username or password for Redshift.';
                debugInfo = { 
                    suggestion: 'Check Redshift credentials',
                    code: error.code 
                };
            } else if (error.code === '3D000') {
                errorType = 'Database Not Found';
                userMessage = 'Database "veritiv" not found in Redshift.';
                debugInfo = { 
                    suggestion: 'Verify database name exists in Redshift cluster',
                    code: error.code 
                };
            } else if (error.code === '42P01') {
                errorType = 'Table Not Found';
                userMessage = 'Table "edm.f_inv" not found in Redshift.';
                debugInfo = { 
                    suggestion: 'Verify table exists in the edm schema',
                    code: error.code 
                };
            }
            
            console.error('Error classification:', errorType);
            console.error('User message:', userMessage);
            console.error('Debug info:', debugInfo);
            
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database Error',
                    errorType: errorType,
                    message: userMessage,
                    timestamp: new Date().toISOString(),
                    requestId: event.requestContext?.requestId || 'unknown',
                    debug: {
                        ...debugInfo,
                        originalError: error.message,
                        errorCode: error.code,
                        connectionHost: 'dev-redshift-instance.cbgfkhkxtpk8.us-east-1.redshift.amazonaws.com',
                        connectionPort: 5439,
                        database: 'veritiv',
                        user: 'hackathon'
                    }
                })
            };
        }
    }

    // Handle other requests
    console.log('Unknown endpoint requested');
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
            error: 'Not Found',
            message: 'The requested endpoint was not found',
            availableEndpoints: ['/hello', '/redshift'],
            timestamp: new Date().toISOString(),
            requestId: event.requestContext?.requestId || 'unknown'
        })
    };
};