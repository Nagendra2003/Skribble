import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import Button from 'react-bootstrap/Button';

const InitialPage = () => {
    const [username, setUsername] = useState('');
    const [joinRoom, setJoinRoom] = useState("Create Room");
    const [roomId, setRoomId] = useState("");
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (joinRoom==="Create Room"){
            let randomroomID = uuidv4();
            history.push(`/lobby/${randomroomID}/${username}`);
        }
        else{
            history.push(`/lobby/${roomId}/${username}`);
        }
    };

    return ( 
        <div className="initial-page">
        <h2>Play Game</h2>
        <form onSubmit={handleSubmit}>  
            <label> Username</label>
            <input type="text"
            required
            value = {username}
            onChange = {(e) => {setUsername(e.target.value)}}
            >
            </input>
            {joinRoom === "Create Room" && <Button variant="primary" onClick={handleSubmit}> Create Room </Button>}
           {joinRoom === "Join Room" && <div className="room-id"> <label> Room ID </label><input type="text" 
           required value={roomId} 
           onChange={(e) => {setRoomId(e.target.value)}}
           > 
           </input>
           <Button variant="primary" onClick={handleSubmit}> Join Room</Button>
           </div>
           }
            <select value={joinRoom} onChange={(e) => {setJoinRoom(e.target.value)}}>
                <option value="Create Room" > 
                    Create Room
                </option>
                <option value="Join Room"> Join Room</option>
            </select>
        </form>
        
        </div>
    );
}
 
export default InitialPage;
