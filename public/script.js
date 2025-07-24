const socket = io();
socket.emit('join-room', IndexID, 10);

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

myPeer.on('open', id => {
    socket.emit('join-room', IndexID, id);
})

const videoGrid = document.getElementById('videoGrid');
const video = document.createElement('video');

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    const otherPeer = new Peer(undefined, {
        host: '/',
        port: '3001'
    })
    socket.on('userDisconnected', userId => {
        console.log(userId);
        if (peers[userId]){
            peers[userId].close();
        } 
    })
    otherPeer.on('open', id => {
        socket.emit('join-room', IndexID, id);
    })
    addVideoStream(video, stream);

    socket.on('userConnected', userId => {
        connectToNewUser(userId, stream);
        otherPeer.on('call', call => {
            call.answer(stream)
        })
    })

    otherPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

})

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.muted = true;
    videoGrid.append(video);
    video.play();
}

const peers = {};

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    }) 

    call.on('close', () =>{
        video.remove();
    })

    peers[userId] = call;
}