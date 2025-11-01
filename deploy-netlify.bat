@echo off
REM Netlify Deployment Script for AI Resume Builder

echo 🚀 Building AI Resume Builder for Netlify deployment...

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist out rmdir /s /q out
if exist .next rmdir /s /q .next

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build for production
echo 🔨 Building static files...
call npm run build

REM Check if build was successful
if exist out (
    echo ✅ Build successful!
    echo 📁 Static files are in the 'out' directory
    echo.
    echo 🌐 Ready for Netlify deployment:
    echo    Option 1: Drag the 'out' folder to netlify.com
    echo    Option 2: Push to Git and connect repository to Netlify
    echo.
    echo 📊 Build stats:
    dir out\*.html /s
    echo.
    echo 🎉 Ready to deploy!
) else (
    echo ❌ Build failed!
    exit /b 1
)
