const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use( (req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    // res.header('Access-Control-Allow-Credentials', true);
    next();
})



app.use(
    express.static(
        path.join(
            __dirname, "../", "build"
        )
    )
)

app.get( '**', ( req, res ) => {

    fs.createReadStream(
        path.join(
            __dirname, '../', 'build', 'index.html'
        )
    ).pipe( res )

})



io.on('connection', handleSocketConnection);

// app.get("/socket.io", (req,res) => {
//     console.log( req.url );
// })



function handleSocketConnection(socket){
    console.log("Coonected")
    socket.on("message", handleSocketMessage)
    socket.on("offer", handleSocketMessage)
    socket.on("answer", handleSocketMessage)
    // socket.on("newClient", handleNewClient)
    // socket.on("newClient", handleNewClient)
    // socket.on("newClient", handleNewClient)
    // socket.on("newClient", handleNewClient)
}

function handleSocketMessage(msg){
    // console.log(msg);
    io.send(msg)
}


http.listen( 3000, () => console.log("Listening at port 3000"))