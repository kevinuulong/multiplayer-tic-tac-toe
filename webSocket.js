const ws = require('ws');

const client = new ws('ws://localhost:3000');

client.on('open', () => {
    // Causes the server to print "Hello"
    client.send('Hello');
});

client.on('message', data => {
    data = JSON.parse(data);
    let event = data.event;
    console.log(event);
    data = data.data || null;

    if (event === 'client-id') {
        console.log(`Client-id: ${data.id}`);
    }
})