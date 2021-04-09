const express = require('express');
const http = require('http');
const app = express();
const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const { nanoid } = require('nanoid');

// Serve index.html on the '/' route
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
})

// Make 'public' directory available
app.use(express.static('public'));

// Set up WebSocket server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`App listening @ http://localhost:${port}`);
})

const wss = new WebSocket.Server({ server: server });

wss.on('connection', (socket) => {
    console.log('connected');
    // Send a sample message to the client
    socket.send(JSON.stringify({
        event: 'client-id', data: {
            id: nanoid(),
            message: 'hello there client'
        }
    }));
    console.log('client Set length: ', wss.clients.size);
    socket.on('close', (socketClient) => {
        console.log('closed');
        console.log('Number of clients: ', wss.clients.size);
    });
    socket.on('message', data => {
        console.log(data);
    })
});