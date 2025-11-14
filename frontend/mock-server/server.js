// mock-server/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Menggunakan db.json
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Custom route for login
server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'sales_user_01' && password === 'password123') {
    res.status(200).json({
      token: "a1b2c3d4-dummy-jwt-token-string-e5f6-secure",
      user: {
        name: "Sales User",
        username: "sales_user_01"
      }
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Use default json-server routes for other requests
server.use(router);

// Start server
server.listen(5000, () => {
  console.log('JSON Server with custom login is running on port 5000');
});