import React, { useState, useEffect, useRef } from 'react';
import Axios from "axios";
import { useParams } from 'react-router';


const Participants=()=>{
    const {roomid,username} = useParams();
    const [alluser,setAllusers]=useState([])

    useEffect(() => {
      console.log("xxxxxxx");
      console.log(roomid);
      Axios.get(`http://localhost:3002/api/getFromRoomId/${roomid}`).then((data) => {
      console.log(data);
      setAllusers(data.data);
    //   setUser({
    //     Password: data.data[0].Password,
    //     Name: data.data[0].Name,
    //     UserName: data.data[0].UserName,
    //     Id: data.data[0].Id,
    //   });

    //   setUserName(data.data[0].UserName);
    //   setPassword(data.data[0].Password);
    //   setName(data.data[0].Name);
    });
    // setShowUpdateForm(false);
  },[]);
    
    return(
        <div>
            <h2>Participants</h2>
            {alluser.length>0 && alluser.map((user,index) => {
              return(
              <p key={index}>{user.UserName}</p>
              )})}
        </div>
    )
  }

export default Participants;