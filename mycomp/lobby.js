import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Board from '../mycomp/board'
import Chat from    '../mycomp/chat'
import './lobby.css'
export default class lobby extends React.Component{
    constructor(props){
        super(props);
        this.state={
            color:"#000000",
            size:"2"
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
    render(){
    return (
    <div className="lobby">
    <Container fluid="md">
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
                 {/* <div className="Eraser">
                 <button type="button" class="btn btn-light" onClick={()=>this.state.color="#00000"}>Eraser</button>
                 </div> */}
                 </div>
                 <div className="canvas">
                 <Board color={this.state.color} size={this.state.size}/>
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
</div>

    )
}
}
