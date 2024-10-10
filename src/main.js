const serverconfig = require('./serverconfig.json')
const utilities = require('./utilities')

const http = require('http');
const { Server } = require('socket.io');
const path = require('path')
const fs = require('fs')
const ip = require('ip')

// Create an HTTP server
const server = http.createServer((req, res) => {
    const url = req.url == '/' ? "/index.html" : req.url
    var p;
    try {
        p = fs.readFileSync(path.join(__dirname, 'public', url))
        res.writeHead(200);
    } catch {
        p = Buffer.alloc(1, 0)
        res.writeHead(404);
    }

    res.end(p);
});

// Create a Socket.IO server
const io = new Server(server);

const positions = {}

// Listen for connection events
io.on('connection', (socket) => {
});

const io_texts = io.of('/texts')
io_texts.on("connection", (socket) => {
    const ipaddr = socket.handshake.address

    socket.emit("your name", ipaddr)

    io_texts.emit('add user', ipaddr)
    io_texts.emit("position update", positions)

    socket.on("chat post", (name, text) => {
        io_texts.emit("chat emit", (`${name.padEnd(15," ")} : ${utilities.escapeHtml(text)}\n`))
    })

    socket.on("disconnect", () => {
        io_texts.emit("remove user", ipaddr)
        delete positions[[ipaddr]]
    })
    socket.on('position push', (data) => {
        positions[[ipaddr]] = { x: data[0], y: data[1] }
        io_texts.emit("position update", positions)
    })
})


serverconfig.address = serverconfig.autoIP == true ? ip.address() : serverconfig.address;
server.listen({ host: serverconfig.address, port: serverconfig.port }, () => {
    console.log(`Server is running on http://${serverconfig.address}:${serverconfig.port}`);
});
