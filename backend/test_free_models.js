import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testModel(modelName) {
  console.log(`Testing model: "${modelName}"`);
  try {
    const model = new ChatGoogleGenerativeAI({
      model: modelName,
      apiKey: apiKey,
    });
    const res = await model.invoke('Hi, answer "ok"');
    console.log(`-> SUCCESS for "${modelName}"! Response:`, res.content || res.text);
    return true;
  } catch (err) {
    console.log(`-> FAILED for "${modelName}":`, err.message);
    return false;
  }
}

async function run() {
  const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-3.5-flash'];
  for (const m of models) {
    await testModel(m);
  }
}

run();
