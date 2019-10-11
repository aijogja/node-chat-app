const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// route render to html template
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// on connection (init from client)
io.on('connection', function(socket){

  socket.on('username', function(username){
    // send event to sender client
    socket.username = username;
    socket.emit('connected', 'You join into chat');
    socket.broadcast.emit('connected', socket.username + ' joined');
  });

  // on client disconnect
  socket.on('disconnect', function(){
    io.emit('disconnected', socket.username + ' leave');
  });

  // on send event (emit)
  socket.on('chat_message', function(msg){
    // send event to client
    io.emit('chat_message', socket.username + ' : ' + msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});  
