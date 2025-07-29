const { Client } = require('pg');

// Common passwords to test
const passwordsToTest = [
    'Hackathon2024!',
    'dedevAI25!',
    'hackathon2024',
    'Hackathon2024',
    'password',
    'hackathon',
    'Hackathon!',
    'Hackathon123!',
    'Hackathon2024!!',
    'dedevAI25',
    'DedevAI25!'
];

async function testPassword(password) {
    const client = new Client({
        host: 'dev-redshift-instance.cbgfkhkxtpk8.us-east-1.redshift.amazonaws.com',
        port: 5439,
        database: 'veritiv',
        user: 'hackathon',
        password: password,
        ssl: true,
        connectionTimeoutMillis: 10000 // 10 second timeout
    });

    try {
        console.log(`Testing password: ${password}`);
        await client.connect();
        console.log(`✅ SUCCESS! Password "${password}" works!`);
        
        // Test a simple query
        const result = await client.query('SELECT current_user, current_database();');
        console.log(`Current user: ${result.rows[0].current_user}`);
        console.log(`Current database: ${result.rows[0].current_database}`);
        
        await client.end();
        return true;
    } catch (error) {
        console.log(`❌ FAILED: ${error.message}`);
        return false;
    }
}

async function testAllPasswords() {
    console.log('=== TESTING REDSHIFT PASSWORDS ===');
    console.log('Testing common passwords for user "hackathon"...\n');
    
    for (const password of passwordsToTest) {
        const success = await testPassword(password);
        if (success) {
            console.log('\n🎉 Found working password!');
            console.log(`Use this in your Lambda function: REDSHIFT_PASSWORD=${password}`);
            break;
        }
        console.log(''); // Empty line for readability
    }
    
    console.log('\n=== PASSWORD TESTING COMPLETE ===');
    console.log('If none of these passwords work, you may need to:');
    console.log('1. Check with your Redshift admin for the correct password');
    console.log('2. Reset the hackathon user password');
    console.log('3. Create a new user with the correct permissions');
}

// Run the test
testAllPasswords().catch(console.error); 