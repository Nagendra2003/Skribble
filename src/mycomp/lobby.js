import React from 'react'
import Board from '../mycomp/board'
import './lobby.css'
import { FaEraser } from 'react-icons/fa';
export default class lobby extends React.Component{
    constructor(props){
        super(props);
        this.state={
            color:"#000000",
            size:"5"
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
            <div className="tools-section">
                <div className="color-picker-container">
                    Select Brush Color : &nbsp; 
                    <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)}/>
                </div>

                <div className="brushsize-container">
                    Select Brush Size : &nbsp; 
                    <select value={this.state.size} onChange={this.changeSize.bind(this)}>
                        <option> 5 </option>
                        <option> 10 </option>
                        <option> 15 </option>
                        <option> 20 </option>
                        <option> 25 </option>
                        <option> 30 </option>
                    </select>
                </div>
                <button> <FaEraser onClick={() => {this.setState({color: "#fff"})}} /> </button>
            </div>
            <div className="Board">
                <Board color={this.state.color} size={this.state.size} />
            </div>
            
    
        </div>
    )
}
}