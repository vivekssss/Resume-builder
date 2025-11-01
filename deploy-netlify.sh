#!/bin/bash

# Netlify Deployment Script for AI Resume Builder

echo "🚀 Building AI Resume Builder for Netlify deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf out
rm -rf .next

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building static files..."
npm run build

# Check if build was successful
if [ -d "out" ]; then
    echo "✅ Build successful!"
    echo "📁 Static files are in the 'out' directory"
    echo ""
    echo "🌐 Ready for Netlify deployment:"
    echo "   Option 1: Drag the 'out' folder to netlify.com"
    echo "   Option 2: Push to Git and connect repository to Netlify"
    echo ""
    echo "📊 Build stats:"
    du -sh out/
    find out -name "*.js" | wc -l | xargs echo "JavaScript files:"
    find out -name "*.css" | wc -l | xargs echo "CSS files:"
else
    echo "❌ Build failed!"
    exit 1
fi
