import https from 'https';

const backendHost = process.env.BACKEND_HOST || 'foodhub-backend-fghd.onrender.com';

const loginData = JSON.stringify({ email: 'user@test.com', password: 'password123' });

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
    console.log('✅ User login successful');

    // Replace the following IDs with real IDs from your DB
    const orderData = JSON.stringify({
      restaurantId: 'REPLACE_WITH_REAL_RESTAURANT_ID',
      orderItems: [
        {
          food: 'REPLACE_WITH_REAL_FOOD_ID',
          qty: 2
        }
      ],
      shippingAddress: '123 Test Street, Test City, 12345',
      paymentMethod: 'Cash on Delivery'
    });

    const orderOptions = {
      hostname: backendHost.split(':')[0],
      port: backendHost.includes(':') ? Number(backendHost.split(':')[1]) : 443,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(orderData),
      },
    };

    const orderReq = https.request(orderOptions, (orderRes) => {
      let orderBody = '';
      orderRes.on('data', (chunk) => (orderBody += chunk));
      orderRes.on('end', () => {
        console.log('Order placement status:', orderRes.statusCode);
        if (orderRes.statusCode === 201) {
          console.log('✅ Order placed successfully!');
          try {
            console.log('Order response:', JSON.parse(orderBody));
          } catch (e) {
            console.log('Order response (raw):', orderBody);
          }
        } else {
          console.log('❌ Order failed:', orderBody);
        }
      });
    });

    orderReq.on('error', (err) => console.error('Order request error:', err));
    orderReq.write(orderData);
    orderReq.end();
  });
});

loginReq.on('error', (err) => console.error('Login error:', err));
loginReq.write(loginData);
loginReq.end();
