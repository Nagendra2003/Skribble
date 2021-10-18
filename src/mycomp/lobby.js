import React from 'react'
import Board from '../mycomp/board'
import './lobby.css'
export default function lobby(){
    return (
        <div className="lobby"> 
            <div className="Board">
                <Board />
            </div>
        </div>
    )
}
