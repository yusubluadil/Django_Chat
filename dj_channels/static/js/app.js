const roomName = JSON.parse(document.getElementById('room-name').textContent);
const user = JSON.parse(document.getElementById('user').textContent);
const conversation = document.getElementById('conversation');
const sendButton = document.querySelector('#send');
const inputField = document.querySelector('#comment');
var isRecord = false;


const chatSocket = new WebSocket('ws://'+ window.location.host+ '/ws/chat/'+ roomName+ '/');


document.getElementById('hiddeninput').addEventListener('change', handleFileSelect, false);
function handleFileSelect() {
    var file = document.getElementById('hiddeninput').files[0];
    getBase64(file, file.type);
};


function getBase64(file, fileType) {
    var type = fileType.split('/')[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function (){
        chatSocket.send(JSON.stringify({
            'what_is_it': type,
            'message': reader.result
        }));
    };
};


conversation.scrollTop = conversation.scrollHeight;


chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const messageType = data.what_is_it;
    if (messageType === 'text') {
        var message = data.message;
    } else if (messageType === 'image') {
        var message = `<img src="${data.message}" style="width: 250px; height: 250px; object-fit: cover;">`;
    } else if (messageType === 'audio') {
        var message = `<audio style="width: 250px;" controls> <source src="${data.message}"> </audio>`;
    } else if (messageType === 'video') {
        var message = `<video style="width: 250px; height: 250px; object-fit: cover;" controls> <source src="${data.message}"> </video>`;
    };

    if (user === data.user) {
        var message = `
        <div class="row message-body">
            <div class="col-sm-12 message-main-sender">
                <div class="sender">
                    <div class="message-text">
                        ${message}
                    </div>
                    <span class="message-time pull-right">
                        ${data.created_date}
                    </span>
                </div>
            </div>
        </div>`;
    } else {
        var message = `
        <div class="row message-body">
            <div class="col-sm-12 message-main-receiver">
                <div class="receiver">
                    <div class="message-text">
                        ${message}
                    </div>
                    <span class="message-time pull-right">
                        ${data.created_date}
                    </span>
                </div>
            </div>
        </div>`;
    };
    conversation.innerHTML += message;
    conversation.scrollTop = conversation.scrollHeight;
};


chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


inputField.focus();


inputField.onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        sendButton.click();
    };
};


sendButton.onclick = function(e) {
    const message = inputField.value;
    chatSocket.send(JSON.stringify({
        'what_is_it': 'text',
        'message': message
    }));
    inputField.value = '';
};


const startStop = document.getElementById('record');
startStop.onclick = () => {
    if (isRecord) {
        stopRecord();
        startStop.style = '';
        isRecord = false;
    } else {
        startRecord();
        startStop.style = 'color:red';
        isRecord = true;
    };
};


function startRecord() {
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            dataArray = [];

            mediaRecorder.ondataavailable = function (e) {
                dataArray.push(e.data);
            };

            mediaRecorder.onstop = function (e) {
                audioData = new Blob(dataArray, {'type': 'audio/mp3'});
                dataArray = [];
                getBase64(audioData, audioData.type);

                stream.getTracks().forEach(function (track) {
                    if (track.readyState == 'live' && track.kind === 'audio') {
                        track.stop();
                    };
                });
            };
        });
};


function stopRecord() {
    mediaRecorder.stop();
};