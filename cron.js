const http = require('http');
require('dotenv').config();

const options = {
  host: process.env.NODE_ENV === 'development' ? 'localhost' : 'api.podfetch.app',
  path: '/v1/cache/' + process.env.CACHE_TOKEN,
  method: 'PUT',
};

if (process.env.NODE_ENV === 'development') {
  options.port = 3333;
}

const req = http.request(options, (res) => {
  console.log(`status code: ${res.statusCode}`);
});

req.on('error', (error) => {
  console.log(error);
});

req.end();
