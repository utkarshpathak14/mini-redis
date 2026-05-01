import { createClient } from 'redis';

async function runTest() {
    console.log("⏳ Connecting to Mini-Redis...");
    
    // This officially formats your commands into RESP (*3\r\n...)
    // and sends them to your localhost:6379
    const client = createClient({
        url: 'redis://127.0.0.1:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();
    console.log("🟢 Connected successfully!\n");

    try {
        // Test 1: SET a value
        console.log("➡️ Sending: SET framework nodejs");
        const setResponse = await client.set('framework', 'nodejs');
        console.log(`⬅️ Server replied: ${setResponse}\n`);

        // Test 2: GET the value
        console.log("➡️ Sending: GET framework");
        const getResponse = await client.get('framework');
        console.log(`⬅️ Server replied: ${getResponse}\n`);

        // Test 3: GET a missing key (Testing the null/nil response)
        console.log("➡️ Sending: GET python");
        const getMissing = await client.get('python');
        console.log(`⬅️ Server replied: ${getMissing}\n`);

    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await client.disconnect();
        console.log("🔴 Disconnected.");
    }
}

runTest();