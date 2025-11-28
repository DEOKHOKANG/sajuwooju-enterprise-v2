#!/usr/bin/env node

/**
 * 🔐 Vercel Environment Variables Uploader
 * Based on: vercel-env-manager skill
 * Version: 1.0.0
 * Created: 2025-11-15
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'QeozRVkagSj3QzumQNFkO8iO';
const ENV_FILE = process.argv[2] || '.env.production';
const ENVIRONMENT = process.argv[3] || 'production';

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const vars = [];

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      continue;
    }

    // Parse key=value
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      vars.push({ key, value });
    }
  }

  return vars;
}

function addEnvVar(key, value, environment, token) {
  try {
    // Use printf to avoid issues with special characters and pipe to vercel env add
    // Remove --yes flag as it's not supported by vercel env add
    const command = `printf "%s" "${value.replace(/"/g, '\\"').replace(/\$/g, '\\$')}" | npx vercel env add "${key}" "${environment}" --token "${token}"`;

    execSync(command, {
      stdio: 'pipe',
      shell: true,
    });

    return { success: true, error: null };
  } catch (error) {
    const errorMsg = error.stderr ? error.stderr.toString() : error.message;

    // Check if already exists
    if (errorMsg.includes('already exists') || errorMsg.includes('Variable with name') || errorMsg.includes('is already set')) {
      return { success: false, error: 'already_exists' };
    }

    return { success: false, error: errorMsg };
  }
}

async function main() {
  log('========================================', 'cyan');
  log('🚀 Vercel Environment Variable Uploader', 'cyan');
  log('========================================', 'cyan');
  log(`📁 File: ${ENV_FILE}`, 'cyan');
  log(`🌍 Environment: ${ENVIRONMENT}`, 'cyan');
  log('========================================', 'cyan');
  console.log('');

  // Check if file exists
  if (!fs.existsSync(ENV_FILE)) {
    log(`❌ Error: File ${ENV_FILE} not found`, 'red');
    process.exit(1);
  }

  // Parse .env file
  log('📋 Parsing environment variables...', 'cyan');
  const envVars = parseEnvFile(ENV_FILE);
  log(`✅ Found ${envVars.length} variables`, 'green');
  console.log('');

  // Counters
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // Upload each variable
  for (let i = 0; i < envVars.length; i++) {
    const { key, value } = envVars[i];
    const num = i + 1;

    log(`⏳ [${num}/${envVars.length}] Adding: ${key}`, 'cyan');

    const result = addEnvVar(key, value, ENVIRONMENT, VERCEL_TOKEN);

    if (result.success) {
      log(`✅ [${num}/${envVars.length}] Added: ${key}`, 'green');
      successCount++;
    } else if (result.error === 'already_exists') {
      log(`⚠️  [${num}/${envVars.length}] Skipped (already exists): ${key}`, 'yellow');
      skipCount++;
    } else {
      log(`❌ [${num}/${envVars.length}] Failed: ${key}`, 'red');
      if (result.error) {
        log(`   Error: ${result.error.substring(0, 100)}`, 'red');
      }
      failCount++;
    }

    console.log('');
  }

  // Summary
  log('========================================', 'cyan');
  log('📊 Upload Complete', 'cyan');
  log('========================================', 'cyan');
  log(`Total Variables: ${envVars.length}`, 'cyan');
  log(`✅ Successfully Added: ${successCount}`, 'green');
  log(`⚠️  Skipped (Already Exist): ${skipCount}`, 'yellow');
  log(`❌ Failed: ${failCount}`, 'red');
  console.log('');

  // Verify
  log('🔍 Verifying environment variables...', 'cyan');
  console.log('');

  try {
    const listCommand = `npx vercel env ls ${ENVIRONMENT} --token ${VERCEL_TOKEN}`;
    execSync(listCommand, { stdio: 'inherit' });
  } catch (error) {
    log('⚠️  Could not list environment variables', 'yellow');
  }

  console.log('');

  // Final status
  if (failCount === 0) {
    log('========================================', 'green');
    log('🎉 All environment variables processed successfully!', 'green');
    log('========================================', 'green');
    console.log('');
    log('⚡ Next steps:', 'yellow');
    log('   1. Verify variables in Vercel dashboard', 'yellow');
    log('   2. Redeploy: npx vercel --prod --token <TOKEN>', 'yellow');
    log('   3. Test deployment URL', 'yellow');
    console.log('');
    process.exit(0);
  } else {
    log('========================================', 'yellow');
    log('⚠️  Some environment variables failed to add', 'yellow');
    log('========================================', 'yellow');
    console.log('');
    log('Please check the errors above and retry manually if needed.', 'yellow');
    console.log('');
    process.exit(1);
  }
}

// Run
main().catch((error) => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
