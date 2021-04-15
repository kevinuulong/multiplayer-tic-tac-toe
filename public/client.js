// Create WebSocket connection.
const socket = new WebSocket('ws://192.168.1.177:3000');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', eventDetails => {
    data = JSON.parse(eventDetails.data);
    let event = data.event;
    console.log(event);
    data = data.data || null;

    if (event === 'client-id') {
        console.log(`Client-id: ${data.id}`);
        document.cookie = `client-id=${data.id}`;
    }
});

document.addEventListener('click', () => {
    socket.send('Click registered!')
})