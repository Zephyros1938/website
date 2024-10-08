const serverconfig = require('./serverconfig.json')

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ip = require('ip')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    ipaddr = socket.handshake.address;

    console.log('A user connected');
    socket.emit('message', "hello")

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('message_recieved', () => {
        console.log(ipaddr)
    })
});

if(serverconfig.autoIP){
    serverconfig.address=ip.address()
}

server.listen({ address: serverconfig.address, port: serverconfig.port }, () => {
    console.log(`Server is running at http://${serverconfig.address}:${serverconfig.port}`);
});
