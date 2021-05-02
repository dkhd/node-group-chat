// modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// config
const ws_cfg = require('./config.json').websocket;

// routes
app.get('/', function(req, res) {
    res.render('index.ejs', {
        ws_prot: ws_cfg.protocol,
        ws_host: ws_cfg.host,
        ws_port: ws_cfg.port
    });
});

// sockets
io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>', socket.username);
    });

    socket.on('disconnect', function() {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>', socket.username);
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message, socket.username, message);
    });

    socket.on('is_typing', function() {
        io.emit('is_typing', '<small><i><u>' + socket.username + ' typing... </u></i></small>', socket.username);
    });
});

// initialize the server
const server = http.listen(ws_cfg.port, ws_cfg.host, function() {
    console.log(`Sever listening on => ${ws_cfg.host}:${ws_cfg.port}`);
});