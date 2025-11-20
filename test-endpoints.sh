#!/bin/bash

BASE_URL="https://nook-9kx3.onrender.com"

echo "🚀 Starting endpoint tests for: $BASE_URL"
echo "============================================================"

# Test Health Check Endpoint
echo -e "\n🔍 Testing Health Check Endpoint..."
echo "GET /health"
curl -s -w "Status: %{http_code}\n" "$BASE_URL/health" | head -20
echo ""

# Test Root Endpoint
echo -e "\n🔍 Testing Root Endpoint..."
echo "GET /"
curl -s -w "Status: %{http_code}\n" "$BASE_URL/" | head -20
echo ""

# Test Mobile Send OTP
echo -e "\n🔍 Testing Mobile Send OTP Endpoint..."
echo "POST /auth/api/mobile/send-otp"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+1234567890"}' \
  -w "Status: %{http_code}\n" \
  "$BASE_URL/auth/api/mobile/send-otp" | head -20
echo ""

# Test Mobile Verify OTP
echo -e "\n🔍 Testing Mobile Verify OTP Endpoint..."
echo "POST /auth/api/mobile/verify-otp"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+1234567890", "otp": "123456"}' \
  -w "Status: %{http_code}\n" \
  "$BASE_URL/auth/api/mobile/verify-otp" | head -20
echo ""

# Test Google OAuth Login
echo -e "\n🔍 Testing Google OAuth Login Endpoint..."
echo "GET /auth/api/google/login"
curl -s -I "$BASE_URL/auth/api/google/login" | grep -E "(HTTP|Location|Status)"
echo ""

# Test Google OAuth Callback
echo -e "\n🔍 Testing Google OAuth Callback Endpoint..."
echo "GET /auth/api/google/callback"
curl -s -w "Status: %{http_code}\n" \
  "$BASE_URL/auth/api/google/callback?code=test_code&state=test_state" | head -20
echo ""

# Test Non-existent Endpoint
echo -e "\n🔍 Testing Non-existent Endpoint..."
echo "GET /non-existent-endpoint"
curl -s -w "Status: %{http_code}\n" "$BASE_URL/non-existent-endpoint" | head -20
echo ""

# Test with different HTTP methods on health endpoint
echo -e "\n🔍 Testing Different HTTP Methods on /health..."
echo "POST /health (should return method not allowed or similar)"
curl -s -X POST -w "Status: %{http_code}\n" "$BASE_URL/health" | head -10
echo ""

echo "============================================================"
echo "✨ All endpoint tests completed!"