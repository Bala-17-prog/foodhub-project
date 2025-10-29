import fetch from 'node-fetch';

(async ()=>{
  const res = await fetch('https://foodhub-backend-fghd.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'restaurant@test.com', password: 'password123' })
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
})();