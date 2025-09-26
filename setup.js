import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

console.log('🚀 Setting up Deft Point Brief Generator...');

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ Please edit .env with your API keys and Notion credentials');
} else {
  console.log('✅ .env file already exists');
}

// Create logs directory
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
  console.log('📁 Created logs directory');
}

console.log('\n�� Setup complete!');
console.log('\nNext steps:');
console.log('1. Edit .env with your API keys');
console.log('2. Set up your Notion database with the required properties');
console.log('3. Test with: npm run gen:one -- --topic "Test Topic"');
console.log('4. Start automation with: node src/automation/scheduler.js');
```

```

