const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const {getRoom} = require("./users");
const port = 8080;
const app = express();

app.use(express());
app.use(cors());

var server = app.listen(port,console.log(`listening on port ${port}`));
const io = socketIO(server);

let roomId = "";

//For storing uids corresponding to a client
const userSocketidMap = new Map();

io.on("connection",(socket) => {
    console.log("New client connected");  
    let userName = socket.handshake.query.userName;
    addClient(userName, socket.id);
    socket.on("JOIN_ROOM", (room)=>{
       roomId = room;
       socket.join(room);
    });
    socket.on("Chat Message", (message) => {
        io.to(roomId).emit("New Message", message);
    });

    socket.on("disconnect",() => {
        console.log("Client disconnected!");
        removeClientFromMap(userName, socket.id);
        io.to(roomId).emit("User disconnectd", socket.id);
    });
});

const removeClientFromMap = (userName, socketID) => {
    if (userSocketidMap.has(userName)){
        let SocketIDS = userSocketidMap.get(userName);
        SocketIDS.delete(socketID);
        if (SocketIDS.size == 0){
            userSocketidMap.delete(userName);
        }
    }
};

const addClient = (userName, socketID) => {
    if (!userSocketidMap.has(userName)){
        userSocketidMap.set(userName, new Set([socketID]));
    }
    else{
        userSocketidMap.get(userName).add(socketID);
    }
}




