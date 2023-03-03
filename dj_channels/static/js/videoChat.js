const user = JSON.parse(document.getElementById('user').textContent);
const secondUser = JSON.parse(document.getElementById('second-user').textContent);

const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');

const microphone = document.getElementById('microphone');
const camera = document.getElementById('camera');

var isMicOpen = true;
var isCamOpen = true;

// Burada etmek istediyim caller ve ya answer-i almaqdir. Terefin teyin edirem.
var side = window.location.search.substring(1).split('=')[1];

const peer = new Peer(user, {host: 'localhost', port: 9000, path: '/'});

// hem sese, hem de videoya cata bilir
navigator.mediaDevices.getUserMedia({audio: true, video: true})
  .then(function (stream){
    video1.srcObject = stream;
    video1.play();
    // sesin gelmesini istemedim ona gorede bele yazdim
    video1.muted = true;

    if (side === 'caller') {
      var call = peer.call(secondUser, stream);
      call.on('stream', function (remoteStream) {
        video2.srcObject = remoteStream;
        video2.play();

      });
    } else {
      peer.on('call', function (call) {
        call.answer(stream);
        call.on('stream', function (remoteStream) {
          video2.srcObject = remoteStream;
          video2.play();
        });
      });
    };

    camera.addEventListener('click', evt => {
      if (isCamOpen) {
        stream.getVideoTracks()[0].enabled = false;
        isCamOpen = false;
        camera.className = 'btn btn-danger';
      } else {
        stream.getVideoTracks()[0].enabled = true;
        isCamOpen = true;
        camera.className = 'btn btn-info';
      };
    });

    microphone.addEventListener('click', evt => {
      if (isMicOpen) {
        stream.getAudioTracks()[0].enabled = false;
        isMicOpen = false;
        microphone.className = 'btn btn-danger';
      } else {
        microphone.getAudioTracks()[0].enabled = true;
        isMicOpen = true;
        microphone.className = 'btn btn-info';
      };
    })
  });