import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const checks = {
      'IFRA Material Compliance Matrix': data.includes('IFRA Material Compliance Matrix'),
      'Regulatory Ceiling Usage Proximity': data.includes('Regulatory Ceiling Usage Proximity'),
      "Chemist's Takeaway": data.includes("Chemist's Takeaway"),
      'Compliance matrix table': data.includes('Restricted Chemical'),
      'Risk level colors': data.includes('text-[#DC2626]') && data.includes('text-[#F59E0B]'),
      'SVG gauges': data.includes('<svg') && data.includes('circle'),
    };

    console.log('\n📊 IFRA Section Verification:\n');
    Object.entries(checks).forEach(([name, found]) => {
      console.log(`${found ? '✅' : '❌'} ${name}`);
    });

    const ifraStartIndex = data.indexOf('IFRA Material Compliance Matrix');
    if (ifraStartIndex > -1) {
      const snippet = data.substring(Math.max(0, ifraStartIndex - 200), ifraStartIndex + 1500);
      fs.writeFileSync(path.join(__dirname, 'ifra_section.html'), snippet);
      console.log('\n📄 IFRA section snippet saved to ifra_section.html');
    }

    const allPassed = Object.values(checks).every(v => v);
    console.log(`\n${allPassed ? '✅ PASS' : '❌ FAIL'}: All IFRA elements verified\n`);
    process.exit(allPassed ? 0 : 1);
  });
});

req.on('error', (error) => {
  console.error('Connection error:', error.message);
  process.exit(1);
});

req.end();
