const spdy = require('spdy');
const fs = require('fs');
const sslOpt = {
    key:  fs.readFileSync(`${__dirname}/certificates/server.key`),
    cert: fs.readFileSync(`${__dirname}/certificates/server.crt`),
};

const express = require('express');
const app = express();


const l = require('./util/log');
app.use(l.middleware); 

const serverTiming = require('server-timing');
app.use(serverTiming());

const delayMiddleware = require('./middleware/addLatency');
app.use(delayMiddleware({delayStartFrom: 20, delayStartTo: 400}));


//Vary: Accept-Encoding
app.use(express.static(process.cwd()));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening HTTP  on port ${port}`));

const sslPort = process.env.SSL_PORT || 8443;
spdy.createServer(sslOpt, app).listen(sslPort, () => console.log(`Listening HTTP2 on port ${sslPort}`));