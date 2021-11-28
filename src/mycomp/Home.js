import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import Axios from "axios";
import Stats from './Stats'
import './Home.css';
import Button from 'react-bootstrap/Button';

const InitialPage = () => {
    const [joinRoom, setJoinRoom] = useState("Create Room");
    const [roomId, setRoomId] = useState("");
    const history = useHistory();
    const {username,databaseid} = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (joinRoom==="Create Room"){
            let randomroomID = uuidv4();
            Axios.post(`http://localhost:3002/api/updateroomid/${databaseid}`,{roomid:randomroomID});
            history.push(`/lobby/${randomroomID}/${username}`);
        }
        else{
            Axios.post(`http://localhost:3002/api/updateroomid/${databaseid}`,{roomid:roomId});
            history.push(`/lobby/${roomId}/${username}`);
        }
    };

    return (
        <div className="initial-page">
        <h2>Play Game</h2>
        <form onSubmit={handleSubmit}>
            
            {joinRoom === "Create Room" && <Button variant="primary" onClick={handleSubmit}> Create Room </Button>}
           {joinRoom === "Join Room" && <div className="room-id"> <label> Room ID </label><input type="text" 
           required value={roomId} 
           onChange={(e) => {setRoomId(e.target.value)}}
           > 
           </input>
           <Button variant="primary" onClick={handleSubmit}> Join Room</Button>
           </div>
           }
           <div>
            <select value={joinRoom} onChange={(e) => {setJoinRoom(e.target.value)}}>
                <option value="Create Room" > 
                    Create Room
                </option>
                <option value="Join Room"> Join Room</option>
            </select>
            </div>
        </form>
        <div class ="user-info">
            <h2>Your Stats</h2>
            <Stats/>
        </div>
        </div>
    );
}
 
export default InitialPage;