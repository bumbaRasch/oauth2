// config/generate_pem_keys.js
import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';

// Generate the key pair
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, 
});

writeFileSync('private.pem', privateKey.export({
    type: 'pkcs1',
    format: 'pem',
}));

writeFileSync('public.pem', publicKey.export({
    type: 'spki',
    format: 'pem',
}));