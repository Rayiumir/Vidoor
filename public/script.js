const socket = io();
socket.emit('join-room', IndexID, 10);