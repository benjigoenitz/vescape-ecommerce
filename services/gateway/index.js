const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', proxy('http://localhost:3000'));
app.use('/products', proxy('http://localhost:3001'));

app.listen(3003, () => {
  console.log('Gateway is Listening to Port 3003');
});
