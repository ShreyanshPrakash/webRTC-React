const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.use( (req,res,next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', true);
    next();
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


http.listen( 4200, () => console.log("Listening at port 4200"))