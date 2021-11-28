
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

var socket = null;

const Chat = ({Socket}) => {
    
    const {roomid,username} = useParams();
    const [messages, setMessages] = useState([]);
    const messagesEnd = useRef(null);

    const [value , setValue] = useState("");

    
    useEffect(() => {
        
        socket = io("http://127.0.0.1:8080",{ transports: [ "websocket" ], query:{userName:username}});
        console.log("HEYEYEYE");
        socket.emit("JOIN_ROOM",roomid);

        return () => {
            socket.disconnect(roomid);
        };
    },[]);

    const handleSubmit = () => {
        
        if(value!==""){socket.emit("New Message",{userName: username,value},roomid);
        setValue("");}
    }

    useEffect(() => {
        socket.on("New Message", (message) => {
            console.log(roomid);
            
            setMessages((prevState) => [...prevState, message]);
        });
    },[socket]);

    useEffect(() => {
        messagesEnd.current.scrollIntoView({behavior : 'smooth'});
    },[messages]);

    return (
        <div className="overflow-auto" id="chat-section">      
            <Container fluid className="p-0">
                <Container className="d-flex flex-column chat-container">
                {/* {messages.length && messages.map((message,index) => <p key={index}>{message.userName}</p>)} */}
                <div className="scroll-content pl-2 pr-2">
                    <div className="container-fluid">
                    {messages.length>0 && messages.map((message,index) => {
                            return (  
                                <div className="speech-wrapper" key={index}>
                                    <div className={`bubble ${message.userName === username ? "" : 'alt'}`}>
                                        <div className="txt">
                                        <p className={`name ${message.userName === username ? "" : 'alt'}`}>{message.userName}</p>
                                        <p className="message">{message.value}</p>
                                        </div>
                                        <div className={`bubble-arrow ${message.userName === username ? "" : 'alt'}`}></div>
                                    </div>
                                {/* 
                                    <div className="bubble alt">
                                        <div className="txt">
                                        <p className="name alt">+353 87 1234 567<span> ~ John</span></p>
                                        <p className="message">Nice... this will work great for my new project.</p>
                                        <span className="timestamp">10:22 pm</span>
                                        </div>
                                        <div className="bubble-arrow alt"></div>
                                    </div> */}
                                    </div>
                                );
                        })}
                </div>

                 <div style={{ float: 'left', clear: 'both' }} ref={messagesEnd} />
                <span>
                    <input required
                    value= {value}
                    onChange={(e)=>{setValue(e.target.value)}}
                    >
                    </input>
                <Button variant="primary"
                    onClick={handleSubmit}
                    >
                    Send
                    </Button>
                </span>
                 </div>
                  
                </Container>
            </Container>
        </div>
  
    );
}
 
export default Chat;
