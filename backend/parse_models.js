import fs from 'fs';

try {
  let raw = fs.readFileSync('models_list.json', 'utf16le');
  if (raw.charCodeAt(0) === 0xFEFF || raw.charCodeAt(0) === 65279) {
    raw = raw.slice(1);
  }
  const data = JSON.parse(raw);
  const names = data.models ? data.models.map(m => m.name) : [];
  console.log('Available models:', names);
} catch (e) {
  console.error('Failed to parse UTF-16:', e.message);
}
