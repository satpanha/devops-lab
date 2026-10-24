const { createServer } = require('node:http');
const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;
const server = createServer(createApp());

server.listen(port, () => {
  console.log(`Notes API listening on port ${port}`);
});