import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';


import Peer from 'simple-peer';
import io from 'socket.io-client';

function App() {

  const [initiatorStream, setInitiatorStream] = useState("");
  const initiatorVideo = useRef("#");
  const receiverVideo = useRef("#");

  const socket = io("http://localhost:3200/");


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      // audio: true 
    })
      .then(stream => {
      //  socket.emit("newClient");
        initInitiatorVideoStream(stream);
      })
      .catch(err => console.log(err));
  }, [])

  const initInitiatorVideoStream = (stream) => {
    initiatorVideo.current.srcObject = stream;
    setInitiatorStream(stream);
    initiatorVideo.current.play();
    let peerType = sessionStorage.getItem("type");
    if( peerType == "initiator"){
      initiateWebRTC("initiator", stream);
    }else{
      createPeer("non", stream);
    }
  }

  const initiateWebRTC = (type, stream) => {
    let peer = new Peer({
      initiator : type == "initiator" ? true : false,
      stream: stream,
      trickle: false
    });

    socket.on('message', msg => {
      console.log(msg);
      if( msg.type == 'answer'){
        console.log("Init has recieved answer");
        peer.signal(msg)
      }
    })
    peer.on('signal', (data) => {
      console.log("Init signal **********************************");
      console.log(data);
      // peer.signal(msg)
      socket.send(data);
    });
    peer.on('close', (event) => {
      console.log("Connection closed");
    });
    peer.on('stream', stream => {
      console.log("Init stream **********************************");
      console.log(stream);
      receiverVideo.current.srcObject = stream;
    // setInitiatorStream(stream);
      receiverVideo.current.play();
    })
    
  }

  const createPeer = (type, stream) => {
    console.log(stream)
    let peer = new Peer({
      initiator : false,
      stream: stream,
      trickle: false
    });

    socket.on('message', msg => {
      console.log(msg);
      if( msg.type == 'offer'){
        console.log("Receiver has recieved offer");
        peer.signal(msg)
      }
    })
    // peer.signal(stream);
    peer.on('signal', (data) => {
      console.log("Receive signal **********************************");
      console.log(data);
      socket.send(data);
    });
    peer.on('close', (event) => {
      console.log("Connection closed");
    });
    peer.on('stream', stream => {
      console.log("Receive stream **********************************");
      console.log(stream);
      receiverVideo.current.srcObject = stream;
    // setInitiatorStream(stream);
      receiverVideo.current.play();
    })
  }


  return (
    <div className="App">
      <div className="initiatorWrapper">
        <h1>Initiator</h1>
        <video ref={initiatorVideo} className="init"></video>
      </div>
      <div className="ReceiverWrapper">
        <h1>Reciever</h1>
        <video ref={receiverVideo} className="recieve"></video>
      </div>
    </div>
  );
}

export default App;
