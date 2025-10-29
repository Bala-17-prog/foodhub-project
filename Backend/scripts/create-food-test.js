import https from 'https';

const backendHost = process.env.BACKEND_HOST || 'foodhub-backend-fghd.onrender.com';

const loginData = JSON.stringify({ email: 'restaurant@test.com', password: 'password123' });

const loginOptions = {
  hostname: backendHost.split(':')[0],
  port: backendHost.includes(':') ? Number(backendHost.split(':')[1]) : 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
  },
};

const loginReq = https.request(loginOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('Login failed:', res.statusCode, body);
      return;
    }
    const { token } = JSON.parse(body);
    console.log('Login token received:', token ? token.substring(0, 20) + '...' : 'none');

    const foodData = JSON.stringify({
      name: 'Test Pizza',
      description: 'Delicious test pizza',
      price: 299,
      category: 'Main Course',
      image: 'https://example.com/pizza.jpg',
      isAvailable: true
    });

    const foodOptions = {
      hostname: backendHost.split(':')[0],
      port: backendHost.includes(':') ? Number(backendHost.split(':')[1]) : 443,
      path: '/api/foods',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(foodData),
        'Authorization': `Bearer ${token}`,
      },
    };

    const foodReq = https.request(foodOptions, (foodRes) => {
      let foodBody = '';
      foodRes.on('data', (chunk) => (foodBody += chunk));
      foodRes.on('end', () => {
        console.log('Food creation status:', foodRes.statusCode);
        try {
          console.log('Food creation response:', JSON.parse(foodBody));
        } catch (e) {
          console.log('Food creation response (raw):', foodBody);
        }
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
