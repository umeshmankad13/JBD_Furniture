import fs from 'fs';
import path from 'path';

// Vite exposes .env values to the client build, but the integrated Express
// server also needs these private values at runtime.
const envPath = path.resolve(process.cwd(), '.env');

try {
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
} catch (error: unknown) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') console.error('Unable to load .env:', error);
}
