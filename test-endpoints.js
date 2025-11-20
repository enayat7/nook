const https = require('https');
const http = require('http');

const BASE_URL = 'https://nook-9kx3.onrender.com';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Endpoint-Tester/1.0',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test functions
async function testHealthEndpoint() {
  console.log('\n🔍 Testing Health Check Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/health`);
    console.log(`✅ GET /health - Status: ${response.status}`);
    console.log(`   Response:`, response.data);
  } catch (error) {
    console.log(`❌ GET /health - Error:`, error.message);
  }
}

async function testMobileSendOTP() {
  console.log('\n🔍 Testing Mobile Send OTP Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/auth/api/mobile/send-otp`, {
      method: 'POST',
      body: {
        mobile: '+1234567890'
      }
    });
    console.log(`✅ POST /auth/api/mobile/send-otp - Status: ${response.status}`);
    console.log(`   Response:`, response.data);
  } catch (error) {
    console.log(`❌ POST /auth/api/mobile/send-otp - Error:`, error.message);
  }
}

async function testMobileVerifyOTP() {
  console.log('\n🔍 Testing Mobile Verify OTP Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/auth/api/mobile/verify-otp`, {
      method: 'POST',
      body: {
        mobile: '+1234567890',
        otp: '123456'
      }
    });
    console.log(`✅ POST /auth/api/mobile/verify-otp - Status: ${response.status}`);
    console.log(`   Response:`, response.data);
  } catch (error) {
    console.log(`❌ POST /auth/api/mobile/verify-otp - Error:`, error.message);
  }
}

async function testGoogleLogin() {
  console.log('\n🔍 Testing Google OAuth Login Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/auth/api/google/login`);
    console.log(`✅ GET /auth/api/google/login - Status: ${response.status}`);
    if (response.status === 302) {
      console.log(`   Redirect Location:`, response.headers.location);
    } else {
      console.log(`   Response:`, response.data);
    }
  } catch (error) {
    console.log(`❌ GET /auth/api/google/login - Error:`, error.message);
  }
}

async function testGoogleCallback() {
  console.log('\n🔍 Testing Google OAuth Callback Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/auth/api/google/callback?code=test_code&state=test_state`);
    console.log(`✅ GET /auth/api/google/callback - Status: ${response.status}`);
    console.log(`   Response:`, response.data);
  } catch (error) {
    console.log(`❌ GET /auth/api/google/callback - Error:`, error.message);
  }
}

async function testRootEndpoint() {
  console.log('\n🔍 Testing Root Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    console.log(`✅ GET / - Status: ${response.status}`);
    console.log(`   Response:`, response.data);
  } catch (error) {
    console.log(`❌ GET / - Error:`, error.message);
  }
}

async function testNonExistentEndpoint() {
  console.log('\n🔍 Testing Non-existent Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/non-existent-endpoint`);
    console.log(`✅ GET /non-existent-endpoint - Status: ${response.status}`);
    console.log(`   Response:`, response.data);
  } catch (error) {
    console.log(`❌ GET /non-existent-endpoint - Error:`, error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting endpoint tests for:', BASE_URL);
  console.log('=' .repeat(60));

  await testHealthEndpoint();
  await testRootEndpoint();
  await testMobileSendOTP();
  await testMobileVerifyOTP();
  await testGoogleLogin();
  await testGoogleCallback();
  await testNonExistentEndpoint();

  console.log('\n' + '='.repeat(60));
  console.log('✨ All tests completed!');
}

// Run the tests
runAllTests().catch(console.error);