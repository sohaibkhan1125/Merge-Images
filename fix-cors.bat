@echo off
REM Firebase Storage CORS Fix Script for Windows
REM Run this script in Command Prompt or PowerShell

echo 🔧 Firebase Storage CORS Fix Script
echo =====================================

REM Check if Firebase CLI is installed
echo.
echo 1. Checking Firebase CLI installation...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Installing...
    npm install -g firebase-tools
    echo ✅ Firebase CLI installed
) else (
    echo ✅ Firebase CLI found
)

REM Check if gsutil is available
echo.
echo 2. Checking Google Cloud SDK (gsutil)...
gsutil version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ gsutil not found. Please install Google Cloud SDK:
    echo    Download from: https://cloud.google.com/sdk/docs/install
    echo    After installation, run: gcloud init
    echo    Then run: gcloud config set project merge-images-75174
    pause
    exit /b 1
) else (
    echo ✅ gsutil found
)

REM Login to Firebase
echo.
echo 3. Checking Firebase authentication...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not authenticated. Please login to Firebase:
    firebase login
) else (
    echo ✅ Firebase authenticated
)

REM Apply CORS configuration
echo.
echo 4. Applying CORS configuration...
gsutil cors set cors.json gs://merge-images-75174.appspot.com
if %errorlevel% neq 0 (
    echo ❌ Failed to apply CORS configuration
    echo    Please run manually: gsutil cors set cors.json gs://merge-images-75174.appspot.com
    pause
    exit /b 1
) else (
    echo ✅ CORS configuration applied successfully
)

REM Verify CORS configuration
echo.
echo 5. Verifying CORS configuration...
gsutil cors get gs://merge-images-75174.appspot.com
if %errorlevel% neq 0 (
    echo ❌ Failed to verify CORS configuration
) else (
    echo ✅ CORS configuration verified
)

echo.
echo 🎉 CORS fix completed!
echo You can now test your blog upload functionality.
echo.
echo Next steps:
echo 1. Start your development server: npm start
echo 2. Go to your admin panel and try uploading an image
echo 3. Check browser console for any remaining errors

pause
