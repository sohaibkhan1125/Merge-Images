#!/bin/bash

# Firebase Storage CORS Fix Script for Unix/Linux/Mac
# Run this script in terminal

echo "🔧 Firebase Storage CORS Fix Script"
echo "==================================="

# Check if Firebase CLI is installed
echo -e "\n1. Checking Firebase CLI installation..."
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    echo "✅ Firebase CLI found: $FIREBASE_VERSION"
else
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
fi

# Check if gsutil is available
echo -e "\n2. Checking Google Cloud SDK (gsutil)..."
if command -v gsutil &> /dev/null; then
    echo "✅ gsutil found"
else
    echo "❌ gsutil not found. Please install Google Cloud SDK:"
    echo "   Download from: https://cloud.google.com/sdk/docs/install"
    echo "   After installation, run: gcloud init"
    echo "   Then run: gcloud config set project merge-images-75174"
    exit 1
fi

# Login to Firebase
echo -e "\n3. Checking Firebase authentication..."
if firebase projects:list &> /dev/null; then
    echo "✅ Firebase authenticated"
else
    echo "❌ Not authenticated. Please login to Firebase:"
    firebase login
fi

# Apply CORS configuration
echo -e "\n4. Applying CORS configuration..."
if gsutil cors set cors.json gs://merge-images-75174.appspot.com; then
    echo "✅ CORS configuration applied successfully"
else
    echo "❌ Failed to apply CORS configuration"
    echo "   Please run manually: gsutil cors set cors.json gs://merge-images-75174.appspot.com"
    exit 1
fi

# Verify CORS configuration
echo -e "\n5. Verifying CORS configuration..."
if CORS_CONFIG=$(gsutil cors get gs://merge-images-75174.appspot.com); then
    echo "✅ CORS configuration verified"
    echo "CORS Configuration:"
    echo "$CORS_CONFIG"
else
    echo "❌ Failed to verify CORS configuration"
fi

echo -e "\n🎉 CORS fix completed!"
echo "You can now test your blog upload functionality."
echo -e "\nNext steps:"
echo "1. Start your development server: npm start"
echo "2. Go to your admin panel and try uploading an image"
echo "3. Check browser console for any remaining errors"

read -p "Press Enter to continue..."
