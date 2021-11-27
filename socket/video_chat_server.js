const express = require("express")
const http = require("http")
const app = express()

const server = http.createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5050",
        method: [ "GET", "POST"]
    }
})

const users = {}

const socketToRoom = {}

io.on("connection", (socket) => {
    
    console.log("user connected");
    socket.on("join room",(roomid)=>{
        if (users[roomid]){
            const length = users[roomid].length;
            if (length === 4){
                socket.emit("room full");
                return;
            }
        }
        else{
            users[roomid] = [socket.id];
        }
        socketToRoom[socket.id] = roomid;
        const usersInRoom = users[roomid].filter(id => id !== socket.id);
        socket.emit("all users", usersInRoom);
        console.log("User joined");
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit("user joined", {signal: payload.signal, callerID: payload.callerID});
        console.log("signal sent");
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit("receiving returned signal", {signal: payload.signal, id: socket.id});
        console.log("signal returned");
    });


    socket.on("disconnect", () => {
        const roomid = socketToRoom[socket.id];
        let room = users[roomid];
        if (room){
            room = room.filter( id => id!==socket.id);
            users[roomid] = room;
        }
    })
})

server.listen(5050, () => {
    console.log("listening on port 5050");
})

