var app=require('express')()
var http=require('http').createServer(app);
var io=require('socket.io')(http,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
});

var server_port= process.env.YOUR_PORT || process.env.PORT || 5050;
http.listen(server_port,()=>{
    console.log("Started on:"+server_port);
})

let users = {}
let socketToRoom = {}
let roundToRoom = {}
let timeToRoom = {}
let maxRounds = 4
let roundGoing = {}
let UserNameToSocket = {}
let socketToUserName = {}
let words = [
    "America",
    "Balloon",
    "Biscuit",
    "Blanket",
    "Chicken",
    "Chimney",
    "Country",
    "Cupcake",
    "Curtain",
    "Diamond",
    "Eyebrow",
    "Fireman",
    "Florida",
    "Germany",
    "Harpoon",
    "Husband",
    "Morning",
    "Octopus",
    "Popcorn",
    "Printer",
    "Sandbox",
    "Skyline",
    "Spinach",
    "Backpack",
    "Basement",
    "Building",
    "Campfire",
    "Complete",
    "Elephant",
    "Exercise",
    "Hospital",
    "Internet",
    "Jalapeno",
    "Mosquito",
    "Sandwich",
    "Scissors",
    "Seahorse",
    "Skeleton",
    "Snowball",
    "Sunshade",
    "Treasure",
    "Blueberry",
    "Breakfast",
    "Bubblegum",
    "Cellphone",
    "Dandelion",
    "Hairbrush",
    "Hamburger",
    "Horsewhip",
    "Jellyfish",
    "Landscape",
    "Nightmare",
    "Pensioner",
    "Rectangle",
    "Snowboard",
    "Spaceship",
    "Spongebob",
    "Swordfish",
    "Telephone",
    "Telescope",
]

//Decrease time every sec

var x = setInterval(function() {
    Object.keys(timeToRoom).map((keyName, keyNumber) => {
        if (roundGoing[keyName]){
            let now = timeToRoom[keyName]-1;
            if (now >= 0 ){
                timeToRoom[keyName] = now;
            }
            if (now == 0){
                roundToRoom[keyName] += 1;
            }
        }
    });
},1000);

let startRound = (room) => {
    timeToRoom[room] = 10;
};

let pickRandomUser = (room) => {
    let usersInRoom = users[room];
    console.log(users);
    try{
    return usersInRoom[Math.floor(Math.random() * usersInRoom.length)];
    }
    catch(err){
        console.log(err);
        return "";
    }
}

let pickRandomWords = () => {
    
    words.sort(() => 0.5 - Math.random());

    return [words[0],words[1],words[2]];
}


io.on("connection", (socket) => {

    socket.on("JOIN_ROOM", (room)=>{
        console.log("User connected");
        let userName = socket.handshake.query.userName;
        if (users[room]){
            let length = users[room].length;

            
            if (length === 4){
                socket.emit("room full");
                return;
            }
            users[room].push(socket.id);
        }
        else{
            users[room] = [socket.id];
        }
        
        if (UserNameToSocket[userName]){
            UserNameToSocket[userName].push(socket.id);
        }
        else{
            UserNameToSocket[userName] = [socket.id];
        }

        socketToUserName[socket.id] = userName;
        console.log(userName);
        if (!timeToRoom[room] && timeToRoom[room]!=0 ){
            startRound(room);
            roundToRoom[room] = 1;
            roundGoing[room] = true;
        }

        socketToRoom[socket.id] = room;
       
        //console.log(timeToRoom[room]);
        socket.emit("Time broadcast", timeToRoom[room]);
        socket.emit("Round number")
        socket.join(room);
        console.log(room);
        io.to(room).emit("New user", roundToRoom[room]);

    });

   
    var timer = setInterval(function() {
        
            if (roundGoing[socketToRoom[socket.id]]){
                console.log(timeToRoom[socketToRoom[socket.id]]);
                io.to(socketToRoom[socket.id]).emit("Global time broadcast", timeToRoom[socketToRoom[socket.id]]);
            }

            if (timeToRoom[socketToRoom[socket.id]] === 0 && roundGoing[socketToRoom[socket.id]]){
                io.to(socketToRoom[socket.id]).emit("Times up");
                roundGoing[socketToRoom[socket.id]] = false;
                console.log(roundToRoom[socketToRoom[socket.id]]);

                if (roundToRoom[socketToRoom[socket.id]] > maxRounds){
                    io.to(socketToRoom[socket.id]).emit("Game over");
                    roundGoing[socketToRoom[socket.id]] = false;
                    console.log("max rounds reached");
                    return;
                }
                else{
                    setTimeout(() => {
                        let socketID = pickRandomUser(socketToRoom[socket.id]);
                        let wordList = pickRandomWords();
                        console.log(socket.id,socketID,socketToUserName[socket.id]);
                        io.to(socketToRoom[socket.id]).emit("User picking word", socketToUserName[socketID]);
                        io.to(socketID).emit("Pick A Word", wordList);
                        
                    },2000);
                }
                // setTimeout(() => {
                //     io.to(socketToRoom[socket.id]).emit("Starting next round");
                //     roundGoing[socketToRoom[socket.id]] = true;
                //     startRound(socketToRoom[socket.id]);
                // },4000);
            }

    },1000);

    socket.on("Chose word", (word) => {
        console.log(word);
        io.to(socketToRoom[socket.id]).emit("User is drawing", socketToUserName[socket.id]);
        socket.emit("Unlock board");
        roundGoing[socketToRoom[socket.id]] = true;
        startRound(socketToRoom[socket.id]);
    });

    socket.on("disconnect",() => {
        console.log("Client disconnected!");
        let roomid = socketToRoom[socket.id];
        let room = users[roomid];
        if (room){
            room = room.filter( id => id!==socket.id);
            users[roomid] = room;
        }
        let newsocketToRoom = {}
        Object.keys(socketToRoom).map((keyName,keyNumber) => {
            if (keyName != socket.id){
                newsocketToRoom[keyName] = socketToRoom[keyName];
            }
        });

        socketToRoom = newsocketToRoom;

        Object.keys(UserNameToSocket).map((keyName, keyNumber ) => {
            if (keyName == socketToUserName[socket.id]){
                let sockets = UserNameToSocket[keyName];
                if (sockets){
                    sockets = sockets.filter( id => id !== socket.id);
                    UserNameToSocket[keyName] = sockets;
                }
            }
        });

        let newsocketToUsername = {}
        Object.keys(socketToUserName).map((keyName, keyNumber) => {
            if (keyName != socket.id){
                newsocketToRoom[keyName] = socketToUserName[keyName];
            }
        });

        socketToUserName = newsocketToUsername;


        io.to(roomid).emit("User disconnected", socket.id);
    });

});
