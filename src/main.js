const serverconfig = require('./serverconfig.json')

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ip = require('ip')
const path = require('node:path')

const app = express()
const server = http.createServer(app);
const io = new socketIo.Server(server);

app.get('*', (req, res) => {
    dir = (__dirname+ '/public'+ req.path)
    console.log(dir)
    res.sendFile(dir)
})

io.on("connection", (socket) => {
    ipaddr = socket.handshake.address;

    console.log('A user connected');
    socket.emit('message', "hello")

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

if (serverconfig.autoIP) {
    serverconfig.address = ip.address()
}

server.listen({ address: serverconfig.address, port: serverconfig.port }, () => {
    console.log(`Server is running at http://${serverconfig.address}:${serverconfig.port}`);
});
