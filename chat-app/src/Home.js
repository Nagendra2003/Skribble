import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { useParams } from 'react-router';
import CanvasDraw from 'react-canvas-draw';


const Home = () => {
    const {roomid,username} = useParams();
    const socket = socketIOClient("http://127.0.0.1:8080",{ transports: [ "websocket" ],
    reconnectionAttempts: 20,
    reconnectionDelay: 5000});

    useEffect(() => {
        socket.on("JOIN ROOM",roomid);
    },[]);

    return (
        <div className="chat-section">
            <h2>{username}</h2>
            <p>{roomid}</p>
        </div>
    );
}
 
export default Home;