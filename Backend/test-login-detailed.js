const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  try {
    console.log('🧪 Testing detailed Login...\n');

    const payload = {
      username: 'admin',
      password: 'password123'
    };

    console.log('Request payload:', JSON.stringify(payload, null, 2));
    console.log('URL:', `${BASE_URL}/login`);
    
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    console.log('\nResponse status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    console.log('Response data:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
