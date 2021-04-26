'use strict';

const connectToPeerBtn = document.querySelector('#connectToPeerBtn');
// const shareScreenBtn = document.querySelector('#shareScreenBtn');
const idInput = document.querySelector('#idInput');
const localVideoArea = document.querySelector('#localVideo');
const remoteVideoArea = document.querySelector('#remoteVideo');

let peer;
let currentPeer;

window.addEventListener('load', () => {
    peer = new Peer();
    peer.on('open', (id) => {
        console.log(id);
    });

    peer.on('call', call => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            call.answer(stream);
            currentPeer = call.peerConnection;
            call.on('stream', remoteStream => {
                renderVideo(remoteStream);
            });
        }).catch(error => {
            console.log(error);
        });
    });
});

function connectToPeer() {
    let remoteId = idInput.value;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(myStream => {
        renderVideo(myStream, localVideoArea);
    }).catch(error => {
        console.log(error);
    });
    // console.log(remoteId);
    callPeer(remoteId);
}

function callPeer(id) {
    hideModal();
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        let call = peer.call(id, stream);
        call.on('stream', remoteStream => {
            currentPeer = call.peerConnection;
            console.log(currentPeer);
            renderVideo(remoteStream, remoteVideoArea);
        });
    }).catch(error => {
        console.log(error);
    });

    document.querySelector('#shareScreenBtn').addEventListener('click', () => {
        // if(navigator.mediaDevices){
            navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always',
                  
                    
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            }).then(stream => {
                let videoTrack = stream.getVideoTracks()[0];
                // console.log(stream.getVideoTracks());
                if (videoTrack.readyState === 'ended') {
                    console.log(1);
                    stopScreenShare(stream);
                }
                // console.log({ videoTrack });
                // console.log({ currentPeer });
                // console.log(sender.track.id);
                // console.log(currentPeer.getSenders());
                // currentPeer.getSenders().forEach(sender => {
                //     sender.addTrack(videoTrack);
                // });
                let sender = currentPeer.getSenders().find(s => {
                    return s.track.kind == videoTrack.kind;
                });
                console.log({ sender });
                sender.replaceTrack(videoTrack);
            }).catch(error => {
                console.log(error);
            });
        // }
    });

    function stopScreenShare(stream) {
        let videoTrack = stream.getVideoTracks()[0];
        let sender = currentPeer.getSenders().find(s => {
            // console.log({s})
            return s.track.kind == videoTrack.kind;
        });
        // console.log({ sender });
        sender.replaceTrack(videoTrack);
    }
}

function renderVideo(stream, videoArea) {
    if (videoArea) {
        videoArea.srcObject = stream;
        let videoPromise = videoArea.play();
        if (videoPromise) {
            videoPromise.then(() => {
                setTimeout(() => {
                    videoArea.play();
                }, 1000);
            }).catch(error => {
                console.log(error);
            })
        }
        videoArea.muted = true;
    }
}

function hideModal() {
    document.getElementById("entry-modal").hidden = true;
}





// let roomId;
// let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// let localStream;
// let currentPeer;

// function createRoom() {
    //     console.log("Creating Room");
//     let room = document.getElementById("room-input").value;
//     roomId = room;
//     let peer = new Peer(roomId);
//     peer.on('open', (id) => {
//         console.log("Peer Connected with ID: ", id);
        // getUserMedia({ video: true, audio: true }, (stream) => {
        //     localStream = stream;
        //     setLocalStream(localStream);
        // }, (err) => {
        //     console.log(err);
        // })
//     })
//     peer.on('call', (call) => {
//         call.answer(localStream);
//         call.on('stream', (stream) => {
//             setRemoteStream(stream);
//             currentPeer = call.peerConnection;
//             console.log('=========CURRENT PEER', currentPeer);
//         });
//     });
// }

// function setLocalStream(stream) {
//     let video = document.getElementById("local-video");
//     video.srcObject = stream;
//     video.muted = true;
//     video.play();
// }

// function setRemoteStream(stream) {
//     let video = document.getElementById("remote-video");
//     video.srcObject = stream;
//     video.play();
// }


// function joinRoom() {
//     console.log("Joining Room")
//     let room = document.getElementById("room-input").value;
//     roomId = room;
//     hideModal();
//     let peer = new Peer();
//     peer.on('open', (id) => {
//         console.log("Connected with Id: " + id);
//         getUserMedia({ video: true, audio: true }, (stream) => {
//             localStream = stream;
//             setLocalStream(localStream);
//             notify("Joining peer");
//             let call = peer.call(roomId, stream);
//             call.on('stream', (stream) => {
//                 setRemoteStream(stream);
//                 currentPeer = call.peerConnection;
//             });
//         }, (err) => {
//             console.log(err);
//         });
//     });
// }