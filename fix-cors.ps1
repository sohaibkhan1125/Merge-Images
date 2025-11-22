# Firebase Storage CORS Fix Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "🔧 Firebase Storage CORS Fix Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Firebase CLI is installed
Write-Host "`n1. Checking Firebase CLI installation..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
    Write-Host "✅ Firebase CLI installed" -ForegroundColor Green
}

# Check if gsutil is available
Write-Host "`n2. Checking Google Cloud SDK (gsutil)..." -ForegroundColor Yellow
try {
    $gsutilVersion = gsutil version
    Write-Host "✅ gsutil found" -ForegroundColor Green
} catch {
    Write-Host "❌ gsutil not found. Please install Google Cloud SDK:" -ForegroundColor Red
    Write-Host "   Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    Write-Host "   After installation, run: gcloud init" -ForegroundColor Cyan
    Write-Host "   Then run: gcloud config set project merge-images-75174" -ForegroundColor Cyan
    exit 1
}

# Login to Firebase
Write-Host "`n3. Checking Firebase authentication..." -ForegroundColor Yellow
try {
    firebase projects:list | Out-Null
    Write-Host "✅ Firebase authenticated" -ForegroundColor Green
} catch {
    Write-Host "❌ Not authenticated. Please login to Firebase:" -ForegroundColor Red
    firebase login
}

# Apply CORS configuration
Write-Host "`n4. Applying CORS configuration..." -ForegroundColor Yellow
try {
    gsutil cors set cors.json gs://merge-images-75174.appspot.com
    Write-Host "✅ CORS configuration applied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to apply CORS configuration" -ForegroundColor Red
    Write-Host "   Please run manually: gsutil cors set cors.json gs://merge-images-75174.appspot.com" -ForegroundColor Cyan
    exit 1
}

# Verify CORS configuration
Write-Host "`n5. Verifying CORS configuration..." -ForegroundColor Yellow
try {
    $corsConfig = gsutil cors get gs://merge-images-75174.appspot.com
    Write-Host "✅ CORS configuration verified" -ForegroundColor Green
    Write-Host "CORS Configuration:" -ForegroundColor Cyan
    Write-Host $corsConfig -ForegroundColor White
} catch {
    Write-Host "❌ Failed to verify CORS configuration" -ForegroundColor Red
}

Write-Host "`n🎉 CORS fix completed!" -ForegroundColor Green
Write-Host "You can now test your blog upload functionality." -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Start your development server: npm start" -ForegroundColor White
Write-Host "2. Go to your admin panel and try uploading an image" -ForegroundColor White
Write-Host "3. Check browser console for any remaining errors" -ForegroundColor White

Read-Host "`nPress Enter to continue..."
