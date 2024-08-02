require('dotenv').config();
const openai = require('openai');

// Create a new OpenAI client
const OpenAI = openai.OpenAI;
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testAPI() {
    try {
        const response = await openaiClient.completions.create({
            model: 'gpt-3.5-turbo',
            prompt: 'This is a test prompt.',
            max_tokens: 5,
        });
        console.log('API response:', response.data);
    } catch (error) {
        console.error('API test error:', error);
    }
}

testAPI();
