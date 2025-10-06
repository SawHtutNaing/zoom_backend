// const socket = io('/');
// const videoGrid = document.getElementById('video-grid');
// const myPeer = new Peer(undefined,{
//     host: '/',
//     port:'3001'
// })

// const myVideo = document.createElement('video');
// myVideo.muted = true;
// const peers = {}
// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//     }).then(stream => {
//     addVideoStream(myVideo,stream);

//     myPeer.on('call',call=>{
//         call.answer(stream);
//         const video = document.createElement('video');
//         call.on('stream',userVideoStream=>{
//             addVideoStream(video, userVideoStream);
//         })
//     })

//     socket.on('user-connected', (userId) => {
//         connectToNewUser(userId,stream);
//         console.log('userid',userId);
//     })
// })
// socket.on('user-disconnected', (userId) => {
//     // console.log('user disconnected', userId);
//     if(peers[userId]) peers[userId].close();
// })

// myPeer.on('open', (id) => {
//     socket.emit('join-room',ROOM_ID,id);

// })


// function connectToNewUser(userId,stream) {
//     const call = myPeer.call(userId,stream);
//     const video = document.createElement('video');
//     call.on('stream',userVideoStream=>{
//         addVideoStream(video,userVideoStream);
//     })
//     call.on('close',()=>{
//         video.remove();
//     })

//     peers[userId] = call;
// }

// function addVideoStream(video,stream){
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     });
//     videoGrid.append(video);
// }



// Create a socket connection
const socket = io('/');

// Get the video grid element
const videoGrid = document.getElementById('video-grid');

// Create a PeerJS instance
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001',
});

// Create a muted video element for self
const myVideo = document.createElement('video');
myVideo.muted = true;

// To manage connected peers and their video elements
const peers = {};
const videoElements = {};

// Access user media (video and audio)
navigator.mediaDevices.getUserMedia({
    video: {
        width: { ideal: 1280 }, // Preferred width (1280px for HD)
        height: { ideal: 720 }, // Preferred height (720px for HD)
        frameRate: { ideal: 30, max: 60 }, // Optional: Frame rate
    },
    video: true,
    audio: true,
}).then((stream) => {
    // Add self video stream
    addVideoStream(myVideo, stream, 'myself');

    // Answer incoming calls and add their streams
    myPeer.on('call', (call) => {
        call.answer(stream); // Answer the call with own stream
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream, call.peer);
        });
    });

    // When a new user connects
    socket.on('user-connected', (userId) => {
        console.log('User connected:', userId);
        connectToNewUser(userId, stream);
    });
});

// Handle user disconnection
socket.on('user-disconnected', (userId) => {
    console.log('User disconnected:', userId);
    if (peers[userId]) peers[userId].close(); // Close the peer connection
    if (videoElements[userId]) {
        videoElements[userId].remove(); // Remove their video element
        delete videoElements[userId];
    }
});

// Emit event when peer connection opens
myPeer.on('open', (id) => {
    // Replace ROOM_ID with your actual room ID variable or hardcode it
    socket.emit('join-room', ROOM_ID, id);
});

// Function to connect to a new user
function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream); // Initiate a call
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream, userId);
    });
    call.on('close', () => {
        if (videoElements[userId]) {
            videoElements[userId].remove(); // Remove video element when call ends
            delete videoElements[userId];
        }
    });

    peers[userId] = call; // Store the peer connection
}

// Function to add video stream to the grid
function addVideoStream(video, stream, userId) {
    if (videoElements[userId]) return; // Prevent adding duplicate video streams

    video.srcObject = stream; // Assign stream to video element
    video.addEventListener('loadedmetadata', () => {
        video.play(); // Play the video once it's loaded
    });
    videoGrid.append(video); // Add video to the grid
    videoElements[userId] = video; // Track video element by user ID
}
