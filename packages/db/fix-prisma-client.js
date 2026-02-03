const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist/generated/prisma/client.js');

try {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const result = data.replace(/globalThis.*import.meta.url.*/g, '// patched');
        fs.writeFileSync(filePath, result, 'utf8');
        console.log('Successfully patched Prisma Client.');
    } else {
        console.warn(`File not found: ${filePath}. Skipping patch.`);
    }
} catch (err) {
    console.error('Error patching Prisma Client:', err);
    process.exit(1);
}
