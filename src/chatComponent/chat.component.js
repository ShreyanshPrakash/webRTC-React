import React from 'react';

import io from 'socket.io-client';

const socket = io("http://localhost:4200");

function ChatComponent(){

    socket.on('message' , (msg) => {
        console.log(msg);
    })

    const handleButtonClick = (event) => {
        socket.send({name:"Hello", id: Math.random()});
    }


    return(
        <React.Fragment>
            <h1>Chat</h1>
            <button onClick={handleButtonClick}>Send</button>
        </React.Fragment>
    )
}


export{
    ChatComponent,
}