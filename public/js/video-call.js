'use strict';

const connectToPeerBtn = document.querySelector('#connectToPeerBtn');
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

  peer.on('call', (call) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        call.answer(stream);
        currentPeer = call.peerConnection;
        call.on('stream', (remoteStream) => {
          renderVideo(remoteStream);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

function connectToPeer() {
  let remoteId = idInput.value;
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((myStream) => {
      renderVideo(myStream, localVideoArea);
    })
    .catch((error) => {
      console.log(error);
    });
  callPeer(remoteId);
}

function callPeer(id) {
  hideModal();
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      let call = peer.call(id, stream);
      call.on('stream', (remoteStream) => {
        currentPeer = call.peerConnection;
        console.log(currentPeer);
        renderVideo(remoteStream, remoteVideoArea);
      });
    })
    .catch((error) => {
      console.log(error);
    });

  document.querySelector('#shareScreenBtn').addEventListener('click', () => {
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          cursor: 'always',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      .then((stream) => {
        let videoTrack = stream.getVideoTracks()[0];
        if (videoTrack.readyState === 'ended') {
          console.log(1);
          stopScreenShare(stream);
        }
        let sender = currentPeer.getSenders().find((s) => {
          return s.track.kind == videoTrack.kind;
        });
        console.log({ sender });
        sender.replaceTrack(videoTrack);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  function stopScreenShare(stream) {
    let videoTrack = stream.getVideoTracks()[0];
    let sender = currentPeer.getSenders().find((s) => {
      return s.track.kind == videoTrack.kind;
    });
    sender.replaceTrack(videoTrack);
  }
}

function renderVideo(stream, videoArea) {
  if (videoArea) {
    videoArea.srcObject = stream;
    let videoPromise = videoArea.play();
    if (videoPromise) {
      videoPromise
        .then(() => {
          setTimeout(() => {
            videoArea.play();
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    videoArea.muted = true;
  }
}

function hideModal() {
  document.getElementById('entry-modal').hidden = true;
}
