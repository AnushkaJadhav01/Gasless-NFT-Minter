#!/bin/bash

# Gasless NFT Minter - Quick Start Installation
# This script sets up the frontend with all fixes applied

set -e

echo "=================================================="
echo "Gasless NFT Minter - Quick Start Setup"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to frontend
cd frontend || exit 1
echo "📂 Working directory: $(pwd)"
echo ""

# Clean installation
echo "🧹 Cleaning previous installation..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm cache clean --force

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""

echo "=================================================="
echo "Next Steps:"
echo "=================================================="
echo ""
echo "1. Set up environment variables:"
echo "   - Copy .env.example to .env (if available)"
echo "   - Update VITE_WALLETCONNECT_PROJECT_ID"
echo "   - Update VITE_UGF_API_KEY"
echo "   - Update VITE_CONTRACT_ADDRESS"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "=================================================="
echo ""
