import https from 'https';

// Default backend host. Override with BACKEND_HOST env var (e.g., localhost:5000 or foodhub-backend-fghd.onrender.com)
const backendHost = process.env.BACKEND_HOST || 'foodhub-backend-fghd.onrender.com';

const postData = JSON.stringify({ email: 'restaurant@test.com', password: 'password123' });

const options = {
  hostname: backendHost.split(':')[0],
  port: backendHost.includes(':') ? Number(backendHost.split(':')[1]) : 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      console.log('Body:', JSON.parse(body));
    } catch (e) {
      console.log('Body (raw):', body);
    }
  });
});

req.on('error', (err) => console.error('Request error', err));
req.write(postData);
req.end();
