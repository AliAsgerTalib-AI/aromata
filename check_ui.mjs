import http from 'http';

const checks = [
  'Artistic Dossier: Scent Story & Concept',
  'Scent Physics: Molecule Mechanics',
  'GC-MS Quantified',
  'Aroma-Chemical Fingerprint',
  'Volatility & Evaporation Decay Vector Map',
  'IFRA Material Compliance Matrix',
  'Regulatory Ceiling Usage Proximity',
  'Spatial Sillage Diffusion Simulator',
  'VAPOR MODELING: ACTIVE PROJECTION',
  'Longevity Metrics',
  'Olfactory Pyramid',
  'Accord Assessment',
  'Market Pricing',
  'Seasonal Wardrobe Integration'
];

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const bundledJs = data.includes('index-') ? '✅' : '❌';
    console.log(`\n📋 UI Component Verification Report\n${'='.repeat(50)}\n`);

    const results = checks.map(check => {
      const found = data.includes(check);
      return {
        check,
        found,
        icon: found ? '✅' : '❌'
      };
    });

    results.forEach(({ icon, check }) => {
      console.log(`${icon} ${check}`);
    });

    const passCount = results.filter(r => r.found).length;
    const total = results.length;
    const percentage = ((passCount / total) * 100).toFixed(0);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ PASS: ${passCount}/${total} sections found (${percentage}%)\n`);

    if (passCount === total) {
      console.log('🎉 All dossier sections are present and rendering!\n');
    } else {
      const missing = results.filter(r => !r.found);
      console.log('⚠️  Missing sections:');
      missing.forEach(({ check }) => console.log(`   - ${check}`));
      console.log();
    }

    process.exit(passCount === total ? 0 : 1);
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error('❌ Request timeout');
  req.destroy();
  process.exit(1);
});

req.end();
