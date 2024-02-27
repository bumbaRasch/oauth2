// utils/generate.js
import crypto from 'crypto';


export function generate_random_string(length) {
  return crypto.randomBytes(length).toString('hex');
}
