const socket = io();
socket.emit('join-room', IndexID, 10);

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
myPeer.on('open', id => {
    socket.emit('join-room', IndexID, id);
})

socket.on('userConnected', userId => {
    //console.log("user "+userId+" connected top room: " + IndexID);
})

const videoGrid = document.getElementById('videoGrids');
const video = document.createElement('video');

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    const otherPeer = new Peer(undefined, {
        host: '/',
        port: '3001'
    })
    otherPeer.on('open', id => {
        socket.emit('join-room', IndexID, id);
    })
    addVideoStream(video, stream);

    socket.on('userConnected', userId => {
        //console.log("user "+userId+" connected top room: " + IndexID);
        connectToNewUser(userId, stream);
    })

    otherPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

})

video.muted = true;

function addVideoStream(video, stream){
    video.srcObject = stream;
    videoGrid.append(video);
    video.play();
}

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
    otherPeer.on('call', call => {
        call.answer(stream)
    })
}