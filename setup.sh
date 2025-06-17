#!/bin/bash

# Web3 Whale Analyzer Setup Script
echo "🐋 Setting up Web3 Whale Analyzer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚙️ Creating .env.local file..."
    cp .env.local .env.local.example
    echo "Please edit .env.local with your API keys before running the application."
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "🔑 Required API Keys:"
echo "- Covalent API Key (https://www.covalenthq.com/docs/api/)"
echo "- Alchemy API Key (https://www.alchemy.com/)"
echo "- OpenAI API Key (https://platform.openai.com/api-keys)"
echo "- Optional: Moralis API Key (https://moralis.io/)"
echo ""
echo "🐋 Happy whale hunting!"
