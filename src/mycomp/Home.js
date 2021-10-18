import React from 'react'
import {Link} from "react-router-dom"
export default function Home(props){
    return (
        <div>
        <div className="mb-3">
            <label for="Title" className="form-label">Username</label>
            <input type="text" className="form-control"/>
        </div>


        <Link to="/lobby">Create Lobby</Link>

        </div>
    )
}
