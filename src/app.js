const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const {v4: uuidV4} = require('uuid');
const fileupload = require('express-fileupload');
const { PeerServer } = require("peer");


const permitsRoutes = require("./routers/permitRouter");
const roleRoutes = require("./routers/roleRouters");
const userRoutes = require("./routers/userRouter");
const roomRouter = require("./routers/roomRouter");
const streanTokenRoutes = require("./routers/streanTokenRouters");

dotenv.config();
connectDB();

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,  // Your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});




// peer js 
// PeerJS Server Setup
const peerServer = PeerServer({
  port: 9000,
  path: '/myapp'
});



app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow only this origin
      // origin: 'https://zoomapp.taxisolutionmm.com', // Allow only this origin

    methods: ['GET', 'POST','PUT','DELETE'],       // Allow specific methods
    // credentials: true ,              // Allow cookies or authorization headers
    allowedHeaders: ['Content-Type', 'Authorization'],

}));


app.options('*', cors()); // Preflight handling


app.use(express.json());
app.use(fileupload());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));




//routers
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req, res) => {
  res.render('room',{roomId: req.params.room})
})

app.use('/permits',permitsRoutes);
app.use("/roles",roleRoutes);
app.use("/users",userRoutes);
app.use("/rooms",roomRouter);
app.use("/generate-token",streanTokenRoutes);


// migration
const defaultData = async (req, res) => {
    let migratior = require("./migrations/migrator");
    migratior.migrate()
}

// defaultData()


app.use((err,req,res,next)=>{
    // console.error(err.stack);
    err.status = err.status || 500;
    res.status(err.status).json({con:false,msg:err.message})
});





// socket



const roomUsers = {}; // Object to keep track of users in rooms

io.on("connection", (socket) => {
  // console.log("New user connected:", socket.id);

  socket.on("join-room", (roomId, userId, userName) => {
    console.log(`User ${userName} (${userId}) joined room ${roomId}`);

    // Initialize the room if it doesn't exist
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }

    // Add the user to the room
    roomUsers[roomId].push({ userId, userName });

    // Join the room
    socket.join(roomId);

    // Broadcast the updated user list to everyone in the room
    io.to(roomId).emit("room-users", roomUsers[roomId]);

    // Notify the room that a new user has connected
    socket.to(roomId).emit('user-connected', userId, userName);
    
    socket.on("send_message", (data) => {
      console.log(`Message in ${data.roomId} from ${data.userId}: ${data.text}`);
      io.to(data.roomId).emit("receive_message", {
        userId: data.userId,
        userName: data.userName,
        text: data.text,
        senderId: socket.id,
      });
    });

    
      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`${userName} disconnected from room ${roomId}`);
        // Remove user from the room
        if (roomUsers[roomId]) {
          roomUsers[roomId] = roomUsers[roomId].filter((user) => user.socketId !== socket.id);
  
          // Notify room and update user list
          io.to(roomId).emit("room-users", roomUsers[roomId]);
          socket.to(roomId).emit("user-left", userName);
  
          // Delete the room if empty
          if (roomUsers[roomId].length === 0) {
            delete roomUsers[roomId];
          }
        }
      });
  });

  // Error handling
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});


module.exports = server;
