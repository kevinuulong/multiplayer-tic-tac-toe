const express = require('express');
const http = require('http');
const app = express();
const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const { nanoid } = require('nanoid');

let clientId;
let sockets = {};

// Serve index.html on the '/' route
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
    console.log(req.headers.cookie);
    clientId = req.headers.cookie ? parseCookie(req.headers.cookie, 'client-id') : undefined;
    console.log(clientId);
})

// Make 'public' directory available
app.use(express.static('public'));

// Set up WebSocket server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`App listening @ http://localhost:${port}`);
})

const wsServer = new WebSocket.Server({ server: server });

wsServer.on('connection', (socket) => {
    // console.log(socket);
    console.log('connected');
    if (!clientId) {
        // Send an id to the client
        clientId = nanoid();
        socket.send(JSON.stringify({
            event: 'client-id', data: {
                id: clientId
            }
        }));
        sockets[clientId] = socket;
        console.log(sockets);
    }
    console.log('client Set length: ', wsServer.clients.size);
    socket.on('close', (socketClient) => {
        delete sockets[clientId];
        console.log(sockets);
        console.log('closed');
        console.log('Number of clients: ', wsServer.clients.size);
    });
    socket.on('message', data => {
        console.log(data);
        console.log(clientId);
    })
});

function parseCookie(cookies, cookieName) {
    var cookie = cookies.match(`${cookieName}=(..*?)(;|$)`)[1];
    return cookie;
}