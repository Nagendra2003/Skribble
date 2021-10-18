import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';

const InitialPage = () => {
    const [username, setUsername] = useState('');
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/lobby/${username}`);
    };

    return ( 
        <div className="initial-page">
        <h2>Enter Username</h2>
        <form onSubmit={handleSubmit}>      
            <input type="text"
            required
            value = {username}
            onChange = {(e) => {setUsername(e.target.value)}}
            >
            </input>
            <button >
             Play
            </button>
        </form>
        
        </div>
    );
}
 
export default InitialPage;
