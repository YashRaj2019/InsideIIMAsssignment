import fs from 'fs';

try {
  const data = fs.readFileSync('models_list.json', 'utf16le');
  const parsed = JSON.parse(data);
  const names = parsed.models ? parsed.models.map(m => m.name) : [];
  console.log('Available models:', names);
} catch (e) {
  console.error('Failed to parse models_list.json:', e.message);
  // Try reading as utf8 just in case
  try {
    const data = fs.readFileSync('models_list.json', 'utf8');
    const parsed = JSON.parse(data);
    const names = parsed.models ? parsed.models.map(m => m.name) : [];
    console.log('Available models (utf8):', names);
  } catch (err) {
    console.error('Failed as utf8 too:', err.message);
  }
}
