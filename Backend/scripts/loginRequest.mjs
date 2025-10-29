import http from 'http';

const data = JSON.stringify({ email: 'restaurant@test.com', password: 'password123' });

const options = {
  hostname: 'foodhub-backend-fghd.onrender.com',
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', (err) => console.error('Request error', err));
req.write(data);
req.end();
