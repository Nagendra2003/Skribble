const { v4: uuidv4 } = require("uuid");

const rooms = [{id:uuidv4(),participants:0},{id:uuidv4(),participants:0},{id:uuidv4(),participants:0},{id:uuidv4(),participants:0}]

const getRoom = (req,res)  => {
    let availabelRoom = '1';
    for (let room of rooms){
        if (room.participants < 5){
            availabelRoom = room.id;
            room.participants += 1;
            break;
        }
    }
    res.status(200).send({Room : availabelRoom});
}

// export {getRoom};