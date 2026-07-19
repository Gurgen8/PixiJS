import { fileURLToPath, URL } from 'node:url';
console.log(fileURLToPath(new URL('./src', import.meta.url)));
