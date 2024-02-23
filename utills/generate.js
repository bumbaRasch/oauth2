// utils/generate.js
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export function generate_random_string(length) {
  return crypto.randomBytes(length).toString('hex');
}

export function generate_UUID() {
  return uuidv4();
}