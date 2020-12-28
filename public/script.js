const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');

myVideo.autoplay = true;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030',
});

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', (call) => {
      call.answer(stream);
      const video = (document.createElement('video').autoplay = true);

      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      connectToNewuser(userId, stream);
    });
  });

peer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id);
});

const connectToNewuser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('Loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};

let texty = $('input');

$('html').keydown((e) => {
  if (e.which == 13 && texty.val().length !== 0) {
    console.log(texty.val());
    socket.emit('message', texty.val());
    texty.val('');
  }
});

socket.on('createMessage', (message) => {
  $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
});
