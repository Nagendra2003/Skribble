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
const roomusermap=new Map();

io.on("connection",(socket) => {
    console.log("New client connected");  
    let userName = socket.handshake.query.userName;
    addClient(userName, socket.id);
    socket.on("JOIN_ROOM", (room)=>{
        if (!roomusermap.has(room)){
            roomusermap.set(room,userName);
        }
        // else{
        //     roomusermap.get(room).add(userName);
        // }
        socket.join(room);
        console.log(room,userName);
    });
    socket.on("New Message", (message,roomid) => {
        io.to(roomid).emit("New Message", message);
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
        removeClientFromMap(userName, socket.id);
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
