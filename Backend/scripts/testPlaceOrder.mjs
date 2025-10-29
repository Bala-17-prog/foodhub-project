import http from 'http';

// Step 1: Login as user
const loginData = JSON.stringify({ email: 'user@test.com', password: 'password123' });

const loginOptions = {
  hostname: 'foodhub-backend-fghd.onrender.com',
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
    console.log('✅ User login successful');

    // Step 2: Place an order
    const orderData = JSON.stringify({
      restaurantId: '68fceedd49c026bfd95097a2', // Test restaurant ID
      orderItems: [
        {
          food: '68fcf8a4a9cd697128df714a', // Test food ID we created earlier
          qty: 2
        }
      ],
      shippingAddress: '123 Test Street, Test City, 12345',
      paymentMethod: 'Cash on Delivery'
    });

    const orderOptions = {
      hostname: 'foodhub-backend-fghd.onrender.com',
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(orderData),
      },
    };

    const orderReq = http.request(orderOptions, (orderRes) => {
      let orderBody = '';
      orderRes.on('data', (chunk) => (orderBody += chunk));
      orderRes.on('end', () => {
        console.log('Order placement status:', orderRes.statusCode);
        if (orderRes.statusCode === 201) {
          console.log('✅ Order placed successfully!');
          console.log('Order response:', JSON.parse(orderBody));
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
