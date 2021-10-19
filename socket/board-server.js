var app=require('express')()
var http=require('http').createServer(app);
var io=require('socket.io')(http,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
});

io.on("connection",(socket)=>{
    console.log("user online");
    socket.on("JOIN ROOM",(roomid)=>{
        socket.join(roomid);
    });
    socket.on('canvas-data',(data,roomid)=>{
        socket.broadcast.to(roomid).emit('canvas-data',data);

    })
    socket.on("disconnect", () => {
        console.log("Client disconnected!");
    });
})
var server_port= process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port,()=>{
    console.log("Started on:"+server_port);
})