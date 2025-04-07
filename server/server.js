// this is the node server that handles socket io connection
// const io = require('socket.io')(8000);
// const express = require('express');
// const cors = require('cors');
// const app = express();
// app.use(cors()); 


// const users = {};

// io.on('connection', (socket) => {
//     socket.on('new-user-joined', (name) => {
//         console.log(name);
//         users[socket.id] = name;
//         socket.broadcast.emit('user-joined', name);
//     });

//     socket.on('send', (message) => {
//         socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
//     });
// })



const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(cors()); // Enable CORS for Express routes

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS options
const io = socketIo(server, {
    cors: {
       // origin: 'http://127.0.0.1:5500', // Allow this origin
         origin: ' http://localhost:8000', // allowed for localhost
        //origin: 'https://revised-chat-app.vercel.app/', // allowed for deployed url
        methods: ['GET', 'POST'], // Specify allowed methods
        credentials: true // Allow credentials (optional)
    }
});

// Users object to track users by socket ID
const users = {};

// event for user joined
io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        // console.log("new user ", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // event for sending message
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // event ffor disconnecting
    socket.on('disconnect', (message) => {
        socket.broadcast.emit('left',  users[socket.id] );
        delete users[socket.id];
    });
});

// Start the server on port 8000
server.listen(8000, () => {
     console.log('Server is running on http://localhost:8000');
});


