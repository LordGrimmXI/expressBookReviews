const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    // Verify the access token using your authentication mechanism
    // If the token is valid, set the user information in the session object
    req.session.user = {
      id: decodedToken.userId,
      name: decodedToken.userName
    };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
 
const PORT = 8000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
