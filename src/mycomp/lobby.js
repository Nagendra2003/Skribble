import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import Board from '../mycomp/board';
import Chat from '../mycomp/chat';
import Peer from 'simple-peer';
import io, { connect } from 'socket.io-client';
import './lobby.css';

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    }, []);

    return (
        <video playsInline autoPlay ref={ref} />
    );
};


const MydModalWithGrid = React.forwardRef((props, ref) => {
    return (
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Using Grid in Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
        <Container>
            <video muted ref={ref} autoPlay playsInline />
            {props.peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
        })

const Lobby = () => {
   
    const {roomid,username} = useParams();
    const [ color, setColor ] = useState("#000000");
    const [ size, setSize ] = useState("2");
    const [ modalShow, setModalShow ] = useState(false);
    const [ peers, setPeers ] = useState([]);
    const socketRef = useRef();
    const userVideo = React.createRef();
    const peersRef = useRef([]);

    useEffect(() => {
        socketRef.current = io("http://localhost:5050",{ transports: [ "websocket" ]});
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then((stream) => {
            
            // try{
            userVideo.current.srcObject = stream;
            // }
            // catch(err){ console.log(err);}
            socketRef.current.emit("join room", roomid);
            console.log("sent signal");

            socketRef.current.on("all users", users => {
                console.log("all users");
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                console.log("user joined");
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                console.log("return signal");
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return <>
    <video muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })} 
    {/* <div className="lobby">
    <Container fluid="md">
        <div>
        <Button variant="primary" className="VoiceCall" onClick={() => setModalShow(true)}>
        Show Videos
        </Button>
        <MydModalWithGrid show={modalShow} onHide={() => setModalShow(false)} peers={peers} ref={userVideo} />
        { modalShow ?
        <Modal show={true} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Using Grid in Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
        
            <video style={{width: "40px", height: "40px"}} muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })} 
        
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal> : null
}
        </div>
    <Row>
    <Col>
        <div className="Participants">
                    <p>Participants</p>
        </div>
    </Col>
    <Col xs={6} >
        <span className="Board">
            <div>
                 <span className="color-picker-container">
                     Select Brush Color : &nbsp; 
                     <input type="color" value={color} onChange={(e) => {setColor(e.target.value)}}/>
                 </span>

                 <span className="brushsize-container">
                     Select Brush Size : &nbsp; 
                     <select value={size} onChange={(e) => {setSize(e.target.value)}}>
                         <option> 2 </option>
                         <option> 5 </option>
                         <option> 10 </option>
                         <option> 15 </option>
                         <option> 20 </option>
                         <option> 25 </option>
                         <option> 30 </option>
                     </select>
                 </span>
                 <div className="Eraser">
                 <button type="button" class="btn btn-light" onClick={()=>this.state.color="#00000"}>Eraser</button>
                 </div> 
                 </div>
                 <div className="canvas">
                 <Board color={color} size={size}/>
                 </div>
         </span>
    </Col>
    <Col>
        <span className="overflow-auto" id="chat-section">
                <Chat/>
        </span>
    </Col>
  </Row>
</Container>
</div> */}

                 </>
}

export default Lobby;

