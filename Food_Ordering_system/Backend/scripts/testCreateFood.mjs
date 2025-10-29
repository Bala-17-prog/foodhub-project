import http from 'http';

// First login to get token
const loginData = JSON.stringify({ email: 'restaurant@test.com', password: 'password123' });

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
  },
};

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    const loginResponse = JSON.parse(body);
    const token = loginResponse.token;
    console.log('Login successful, token:', token?.substring(0, 20) + '...');

    // Now try to create food
    const foodData = JSON.stringify({
      name: 'Test Pizza',
      description: 'Delicious test pizza',
      price: 299,
      category: 'Main Course',
      image: 'https://example.com/pizza.jpg',
      isAvailable: true
    });

    const foodOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/foods',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(foodData),
      },
    };

    const foodReq = http.request(foodOptions, (foodRes) => {
      let foodBody = '';
      foodRes.on('data', (chunk) => (foodBody += chunk));
      foodRes.on('end', () => {
        console.log('Food creation status:', foodRes.statusCode);
        console.log('Food creation response:', foodBody);
      });
    });

    foodReq.on('error', (err) => console.error('Food request error:', err));
    foodReq.write(foodData);
    foodReq.end();
  });
});

loginReq.on('error', (err) => console.error('Login request error:', err));
loginReq.write(loginData);
loginReq.end();
