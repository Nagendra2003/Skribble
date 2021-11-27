import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Board from '../mycomp/board';
import Chat from    '../mycomp/chat';
import Participants from '../mycomp/participants';
import pen from '../img/pen.gif';
import eraser from '../img/rubber.gif';

import './lobby.css'
export default class lobby extends React.Component{
    constructor(props){
        super(props);
        this.state={
            color:"#000000",
            size:"2",
            mode:"pen"
        }
    }
    changeColor(params) {
        this.setState({
            color: params.target.value
        })
    }

    changeSize(params) {
        this.setState({
            size: params.target.value
        })
    }
    changeMode(val) {
        this.setState({
            mode: val
        })
    }
    render(){
    return (
    <div className="lobby">
    <Container fluid="md">
    <Row>
    <Col>
        <div className="Participants">
            <Participants/>
        </div>
    </Col>
    <Col xs={6} >
        <span className="Board">
            <div>
                 <span className="color-picker-container">
                     Select Brush Color : &nbsp; 
                     <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)}/>
                 </span>
                 <span className="brushsize-container">
                     Select Brush Size : &nbsp; 
                     <select value={this.state.size} onChange={this.changeSize.bind(this)}>
                         <option> 2 </option>
                         <option> 5 </option>
                         <option> 10 </option>
                         <option> 15 </option>
                         <option> 20 </option>
                         <option> 25 </option>
                         <option> 30 </option>
                     </select>
                 </span>
                 <span className="Pen">
                 <button type="button" class="btn btn-black" onClick={()=>this.changeMode("pen")}><img src={pen} alt="pen"></img></button>
                 </span>
                 <span className="Eraser">
                 <button type="button" class="btn btn-black" onClick={()=>this.changeMode("eraser")}><img src={eraser} alt="eraser"></img></button>
                 </span>
                 <span className="Eraser">
                 <button type="button" class="btn btn-black" onClick={()=>this.changeMode("delete")}><img src="sns" alt="delete"></img></button>
                 </span>
                 </div>
                 <div className={this.state.mode==="eraser" ? "canvas2" : "canvas1"} >
                    <Board color={this.state.color} size={this.state.size} mode={this.state.mode}/>
                 </div>
         </span>
    </Col>
    <Col>
        <span className="overflow-auto" id="chat-section">
                <Chat/>
        </span>
    </Col>
  </Row>
  <div>

  </div>
</Container>
</div>

    )
}
}
