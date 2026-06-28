import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testGemini(apiVersion) {
  console.log(`\n--- Testing with apiVersion: "${apiVersion || 'default (v1beta)'}" ---`);
  try {
    const config = {
      model: 'gemini-1.5-flash',
      apiKey: apiKey,
    };
    if (apiVersion) {
      config.apiVersion = apiVersion;
    }
    const model = new ChatGoogleGenerativeAI(config);
    const res = await model.invoke('Hello, respond in one word.');
    console.log('Success! Response:', res.content || res.text);
    return true;
  } catch (err) {
    console.error('Failed:', err.message);
    return false;
  }
}

async function run() {
  console.log('API Key starts with:', apiKey ? apiKey.substring(0, 5) + '...' : 'none');
  const defaultOk = await testGemini();
  const v1Ok = await testGemini('v1');
}

run();
