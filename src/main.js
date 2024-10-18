const serverconfig = require('./serverconfig.json')
const utilities = require('./utilities')

const http = serverconfig.port === 443 ? require('node:https') : require('node:http');
const fs = require('node:fs')
const { Server } = require('socket.io');
const path = require('node:path')
const ip = require('ip')

const options = {}

if (serverconfig.port === 443) {
    try {
        const key = fs.readFileSync('./certificates/private_key.pem')
        const cert = fs.readFileSync('./certificates/private_cert.pem')
        options["key"] = key
        options["cert"] = cert
    } catch {
        console.log("You do not have the proper key and cert files.\nplease switch to a different port if you wish to use https, or provide the proper files.\nFIX:\n\tadd src/certificates/private_key.pem\n\tadd certificates/private_cert.pem")
        return
    }
}


// Create an HTTP server
var connectedUsers = []
const server = http.createServer(options, (req, res) => {
    const url = req.url == '/' ? "/index.html" : req.url == 'favicon.ico' ? "/static/favicon.ico" : req.url
    var p;
    try {
        p = fs.readFile(path.join(__dirname, 'public', url), (error, data) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/html' })
                res.end(`Error loading page:\n${error}`)
                return
            }

            if (url.includes('.html')) {
                data = data.toString('utf8').replace("<!-- META_TAGS -->", utilities.generateMetaTags(url))
                if (url.includes("/index.html")) {
                    const replacer = utilities.generateUrlLinks()
                    data = data.replace("<!-- INDEX_LINKS -->", replacer)
                }
                res.writeHead(200);
                res.end(data)
            } else {
                res.writeHead(200);
                res.end(data)
            }
        })
    } catch {
        res.writeHead(404);
        res.end();
    }
});

// Create a Socket.IO server
const io = new Server(server);

const positions = {}
var connected = 0
// Listen for connection events
io.on("connection", (socket) => {
    var socketCount = 0
    connectedUsers.filter(x => { x == socket.handshake.address ? socketCount++ : socketCount })
    if (socketCount > 0) {
        socket.disconnect(true);
        return
    }
    connected++;
    connectedUsers.push(socket.handshake.address)
    io.emit("connection count update", connected)
    console.log(connectedUsers)
    socket.on("disconnect", () => {
        connected--;
        connectedUsers = connectedUsers.filter(item => item !== socket.handshake.address)
        io.emit("connection count update", connected)
        console.log(connectedUsers)
    })
});

const io_texts = io.of('/texts')
io_texts.on("connection", (socket) => {
    const ipaddr = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;

    socket.emit("your name", ipaddr)

    io_texts.emit('add user', ipaddr)
    io_texts.emit("position update initial", positions)

    socket.on("chat post", (name, text) => {
        if (text.split("\n").length > 1) {
            text = utilities.escapeHtml(text).split("\n")[0] + " - CUTOFF"
        }
        io_texts.emit("chat emit", (`<pre>${name.padEnd(15, " ")} : ${text}</pre>`))
    })

    socket.on("disconnect", () => {
        io_texts.emit("remove user", ipaddr)
        delete positions[[ipaddr]]
    })
    socket.on('position push', (x,y) => {
        positions[[ipaddr]] = { x: x, y: y }
        io_texts.emit("position update", ipaddr, x, y)
    })
})


serverconfig.address = serverconfig.autoIP == true ? ip.address() : serverconfig.address;

server.listen({ host: serverconfig.address, port: serverconfig.port }, () => {
    console.log(`Server is running on https://${serverconfig.address}:${serverconfig.port}`);
});
