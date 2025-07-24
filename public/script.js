const socket = io();
socket.emit('join-room', IndexID, 10);
let myVideoStream;
const peers = {}

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
    myVideoStream = stream;
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

    const muteButton = document.querySelector("#muteButton");
    const stopVideo = document.querySelector("#stopVideo");
    const inviteButton = document.querySelector("#inviteButton");
    muteButton.addEventListener("click", () => {
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if(enabled){
            myVideoStream.getAudioTracks()[0].enabled = false;
            html = `<i class = "fas fa-microphone-slash"></i>`;
            muteButton.classList.add("back_red");
            muteButton.innerHTML = html;
            
        }else{
            myVideoStream.getAudioTracks()[0].enabled = true;
            html = `<i class = "fa-duotone fa-microphone"></i>`;
            muteButton.classList.remove("backRed");
            muteButton.innerHTML = html;
        }
    })

    stopVideo.addEventListener("click", () => {
        const enabled = myVideoStream.getVideoTracks()[0].enabled;
        if(enabled){
            myVideoStream.getVideoTracks()[0].enabled = false;
            html = `<i class = "fa-duotone fa-video-slash"></i>`;
            stopVideo.classList.add("backRed");
            stopVideo.innerHTML = html;
        }else{
            myVideoStream.getVideoTracks()[0].enabled = true;
            html = `<i class = "fa-duotone fa-video"></i>`;
            stopVideo.classList.remove("backRed");
            stopVideo.innerHTML = html;
        }
    })

    inviteButton.addEventListener("click", () => {
        prompt("To invite others to video chatroom, copy the following address",
            window.location.href
        )
    })

})

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.muted = true;
    video.play();
    videoGrid.append(video);
}

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