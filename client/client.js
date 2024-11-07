
const socket = io('http://localhost:8000');

// appends event to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
}
const form = document.getElementById('sendcontainer');
const messageInput = document.getElementById('messageinp');
const messageContainer = document.querySelector('.container');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageinp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageinp.value = '';
})

// asking user name
const name = prompt("Enter your name:");
socket.emit('new-user-joined', name);

// accepting the user name
socket.on('user-joined', (name) =>{
    append(`${name} joined the chat`, 'right');
})

// receiving the message from the user 
socket.on('receive', data =>{
    append(` ${data.name} : ${data.message}`, 'left');
})

// accepting disconnected user 
socket.on('left', (name) =>{
    append(` ${name} left the chat`, 'right');
})