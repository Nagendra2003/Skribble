const { time } = require('console');
const e = require('cors');

var app=require('express')()
var http=require('http').createServer(app);
var io=require('socket.io')(http,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
});

var server_port= process.env.YOUR_PORT || process.env.PORT || 8080;
http.listen(server_port,()=>{
    console.log("Started on:"+server_port);
})



//For storing uids corresponding to a client
const userSocketidMap = new Map();
const users = {}
const pointToUsername = new Map();

io.on("connection",(socket) => {
    console.log("New client connected",socket.id);  
    

    socket.on("JOIN_ROOM", (room,username)=>{
        // let userName = socket.handshake.query.userName;
        // if (!roomusermap.has(room)){
        //     roomusermap.set(room,userName);
        // }
        // else{
        //     roomusermap.get(room).add(userName);
        // }
        if (users[room]){
            const length = users[room].length;
            if (length === 4){
                socket.emit("room full");
                return;
            }
        }
        else{
            users[room] = [socket.id];
        }
        //console.log(timeToRoom[room]);
        pointToUsername.set(username,0);
        socket.join(room);
        console.log(room);
    });


    socket.on("New Message", (message,roomid,time) => {
        if (message.correct===true){
            io.to(roomid).emit("New Message", message);
            socket.emit("New Message", {userName: message.userName, value: "Correct guess"});
            let currPoints = pointToUsername.get(message.userName);
            pointToUsername.set(message.userName, currPoints+time);
            io.to(roomid).emit("Updated points", Array.from(pointToUsername));
        }
        else if (message.correct === false){
            io.to(roomid).emit("New Message", message);
        }
        else{
            io.to(roomid).emit("New Message", message);
        }
    });

    socket.on("canvas-data",(data,roomid)=>{
        io.to(roomid).emit("canvas-data",data);
    });
    socket.on("getroom",(roomid)=>{
        console.log(roomusermap);
        io.to(roomid).emit("getroom",roomusermap);
    });
    socket.on("disconnect",(roomid) => {
        console.log("Client disconnected!");
        // removeClientFromMap(userName, socket.id);
        // const roomid = socketToRoom[socket.id];
        let room = users[roomid];
        if (room){
            room = room.filter( id => id!==socket.id);
            users[roomid] = room;
        }
        io.to(roomid).emit("User disconnectd", socket.id);
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
