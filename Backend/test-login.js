const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  try {
    console.log('🧪 Testing Login with seed credentials...\n');

    // Test credentials from seed.ts
    const testCases = [
      {
        name: 'Admin Login',
        username: 'admin',
        password: 'password123'
      },
      {
        name: 'Teacher Login',
        username: 'teacher',
        password: 'password123'
      },
      {
        name: 'Student Login',
        username: 'student1',
        password: 'password123'
      }
    ];

    for (const testCase of testCases) {
      console.log(`📌 Testing: ${testCase.name}`);
      
      try {
        const response = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: testCase.username,
            password: testCase.password
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log(`✅ SUCCESS - Status: ${response.status}`);
          console.log(`   Username: ${testCase.username}`);
          console.log(`   Password: ${testCase.password}`);
          console.log(`   Response:`, JSON.stringify(data, null, 2));
        } else {
          console.log(`❌ FAILED - Status: ${response.status}`);
          console.log(`   Error:`, data);
        }
      } catch (testError) {
        console.log(`❌ Request Error:`, testError.message);
      }
      console.log('---\n');
    }

    console.log('\n📊 Summary:');
    console.log('Default credentials created during seed:');
    console.log('┌─ Admin');
    console.log('│  Username: admin');
    console.log('│  Password: password123');
    console.log('│  Email: admin@test.com');
    console.log('├─ Teacher');
    console.log('│  Username: teacher');
    console.log('│  Password: password123');
    console.log('│  Email: teacher@test.com');
    console.log('└─ Student');
    console.log('   Username: student1');
    console.log('   Password: password123');
    console.log('   Email: stud1@test.com');

  } catch (error) {
    console.error('🔴 Test failed:', error.message);
  }
}

testLogin();
