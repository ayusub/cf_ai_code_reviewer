#!/bin/bash

# AI Code Reviewer - Setup Script
# This script will help you get started quickly

echo "🚀 Setting up AI Code Reviewer..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Login to Cloudflare
echo "🔐 Login to Cloudflare..."
echo "This will open your browser. Please login to your Cloudflare account."
npx wrangler login
echo ""

# Run dev server
echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To deploy to Cloudflare, run:"
echo "  npm run deploy"
echo ""
echo "📝 Don't forget to:"
echo "  1. Create a GitHub repo starting with 'cf_ai_'"
echo "  2. Push your code"
echo "  3. Submit the repo URL in your application"
