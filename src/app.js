const express = require('express')
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT
const userRouter = require('./routers/user')
const conversationRouter = require('./routers/conversation')
require('./db/db')


let app = express();
let server = http.createServer(app);

app.use(express.json())
app.use(userRouter)
app.use(conversationRouter);


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


server.listen(port || 3500, () => {
	console.log(process.env.MONGODB_URL);
    console.log(`Server running on port ${port}`)
})

const io = socketIO(server);


io.on('connection', function(socket){
 // console.log('a user connected for react native');

  socket.on("chat message",msg => {
  	console.log(msg);
  })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  
})