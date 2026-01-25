#!/usr/bin/env node

/**
 * Vercel Deployment Script for SkillBridge AI
 * This script will deploy your application to Vercel with all necessary configurations
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function deploy() {
    console.log('🚀 SkillBridge AI - Vercel Deployment Script\n');

    // Check if environment variables are needed
    console.log('📋 Before deploying, make sure you have:');
    console.log('   1. MongoDB Atlas connection string');
    console.log('   2. JWT Secret key');
    console.log('   3. Google Maps API key\n');

    const proceed = await question('Do you want to proceed with deployment? (yes/no): ');

    if (proceed.toLowerCase() !== 'yes' && proceed.toLowerCase() !== 'y') {
        console.log('❌ Deployment cancelled.');
        rl.close();
        return;
    }

    try {
        console.log('\n📦 Deploying to Vercel...\n');

        // Deploy to Vercel
        execSync('npx vercel --prod', {
            stdio: 'inherit',
            cwd: __dirname
        });

        console.log('\n✅ Deployment completed!');
        console.log('\n⚠️  IMPORTANT: Set these environment variables in Vercel Dashboard:');
        console.log('   - MONGODB_URI: Your MongoDB connection string');
        console.log('   - JWT_SECRET: Your JWT secret key');
        console.log('   - JWT_EXPIRE: 30d');
        console.log('   - NODE_ENV: production');
        console.log('\n🔗 Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables\n');

    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        console.log('\n💡 Try running manually: npx vercel --prod');
    }

    rl.close();
}

deploy();
