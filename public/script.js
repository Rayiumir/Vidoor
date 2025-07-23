const socket = io();
socket.emit('join-room', IndexID, 10);

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

myPeer.on('open', id = {
    socket.emit('join-room', IndexID, id)
})

// socket.on('userConnected', userId => {
//     console.log("user "+userId+" connected top room: " + IndexID);
// })

const videoGrid = document.getElementById('video-group');
const video = document.createElement('videos');

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream = {
    video.srcObject = stream;
    video.play();
    videoGrid.append('video');
})

video.muted = true;