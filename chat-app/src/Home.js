import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router';
import CanvasDraw from 'react-canvas-draw';
import Container from 'react-bootstrap/Container';

const socket = io("http://127.0.0.1:8080",{ transports: [ "websocket" ]});

const Home = () => {
    const {roomid,username} = useParams();
    
    const [messages, setMessages] = useState([]);
    const messagesEnd = useRef(null);

    const [value , setValue] = useState("");

    
    useEffect(() => {
        console.log("HEYEYEYE");
        socket.emit("JOIN_ROOM",roomid);

        return () => {
            socket.disconnect(roomid);
        };
    },[]);

    const handleSubmit = () => {
        
        socket.emit("New Message",{userName: username,value},roomid);
        setValue("");
    }

    useEffect(() => {
        socket.on("New Message", (message) => {
            console.log(roomid);
            
            setMessages((prevState) => [...prevState, message]);
            
            console.log(messages);
        });
    },[socket]);

    useEffect(() => {
        messagesEnd.current.scrollIntoView({behavior : 'smooth'});
    },[messages]);

    return (
        <div className="chat-section">
            
            {/* <Container fluid className="p-0">
                <Container className="d-flex flex-column chat-container"> */}
                {/* {messages.length && messages.map((message,index) => <p key={index}>{message.userName}</p>)} */}
                <div className="scroll-content pl-2 pr-2">
                        
                    {messages.length && messages.map((message)=>{
                        <div className={`msg-container msg-container-${
                            message.userName === username ? 'right' : 'left'
                        }`}>
                            <div className="msg-header">
                                <span	className="msg-user-name">      
                                    {message.userName}
                                </span>
                            </div>
                            <div className="msg-content">
                                <span className="msg-text">
                                    {message.value}
                                </span>
                            </div>
                        </div>
                    })
                }
                {/* <h2>{messages.length>0 && <p>{messages[0].value}</p>}</h2> */}
                 <div style={{ float: 'left', clear: 'both' }} ref={messagesEnd} />
                <span>
                    <input required
                    value= {value}
                    onChange={(e)=>{setValue(e.target.value)}}
                    >
                    </input>
                <button className="ml-2"
                    onClick={handleSubmit} 
                >
                    Send
                </button>
                </span>
                 </div>
                  
                {/* </Container>
            </Container> */}
        </div>
  
    );
}
 
export default Home;