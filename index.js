/**
 * Created by simplecoco on 2017/7/12.
 */

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var path = require('path');
// console.log(http);
// var html = path.resolve(__dirname + "index.html");
// console.log(html);

const offlineUsers = [
  {
    userName: 'Coco',
    uid: '1109',
    socketId: ''
  },
  {
    userName: 'Mr.Chen',
    uid: '777',
    socketId: ''
  }
]

let onlineUsers = []

app.get('/', function(req, res){
    console.log('ssss');
    // res.sendFile(__dirname + '/index.html');
});
// app.use(express.static(__dirname));

io.on('connection',function (socket) {
    console.log('a user connected');
    console.log(onlineUsers, '1');
    
    
    // 找出登入的用户
    // 这里先拿出未登录的队列第一个用户
    const loginUser = offlineUsers.shift()
    console.log(loginUser, 'loginUser');
    loginUser.socketId = socket.id

    // 这里假装将用户存入session中
    onlineUsers.push(loginUser)
    
    if (io.sockets.connected[socket.id]) {
      io.sockets.connected[socket.id].emit('connected', loginUser);
    }
    // io.emit('connected', loginUser)
    
    console.log(onlineUsers, '2');

    
    socket.broadcast.emit('hi');
    socket.on('chat message', function (record) {
        console.log('message:' + record);
        io.emit('chat message', record);
    });
    socket.on('disconnect',function (reason){
        console.log(reason);
        console.log(socket.id);
        console.log(onlineUsers, '3');
        
        // 找出登出用户
        const tmpLogoutUser = onlineUsers.find((item) => {
          return item.socketId === socket.id
        })
        
        // 将用户从session中取出，放入未登录队列中
        const logoutUser = onlineUsers.splice(onlineUsers.indexOf(tmpLogoutUser), 1)[0]
        logoutUser.socketId = ''
        offlineUsers.push(logoutUser)
        
        console.log(onlineUsers, '4');
        console.log('user disconnected');
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});