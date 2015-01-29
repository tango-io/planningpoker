'use strict';

var uuid = require('node-uuid');
var _ = require('lodash');
var rooms = {};

exports.register = function(socket, io) {
  socket.on('newSession', function(){ onNewSession(socket);});
  socket.on('joinSession', function(data){ onJoinSession(io, socket, data);});
  socket.on('updateDescription', function(data){ updateDescription(socket, data);});
  socket.on('vote', function(data){ onVote(io, socket, data);});
  socket.on('revealVotes', function(data){onRevealVotes(io, socket, data);});
  socket.on('clearSession', function(data){onClearSession(socket, data)});
  socket.on('leaveSession', function(data){onLeaveSession(socket);});
  socket.on('disconnect', function(data){onLeaveSession(socket);});
};

function onNewSession(socket) {
  var roomid = uuid.v1();
  rooms[roomid] = {users: [], votes: {}};
  socket.emit('sessionCreated', roomid);
};

function onJoinSession(io, socket, data) {
  if(rooms[data.id]){
    socket.join(data.id);
    rooms[data.id].users.push({username: data.username, socketId: socket.id});
    socket.emit('joinedSession', {id: socket.id, description: rooms[data.id].description});

    io.to(data.id).emit('hideVotes');
    io.to(data.id).emit('updateUsers', {users: rooms[data.id].users});
  }else{
    socket.emit('errorMsg', {message: "Session does not exist"});
  }
};

function updateDescription(socket, data) {
  rooms[data.id].description = data.description;
  socket.broadcast.to(data.id).emit('descriptionUpdated', data.description);
};

function onVote(io, socket, data) {
  var user = _.findWhere(rooms[data.id].users, {socketId: data.userId});
  user.voted = true;
  rooms[data.id].votes[data.userId] = data.vote;

  var numVotes = _.groupBy(rooms[data.id].users, 'voted').true.length;

  //if all user has voted
  if(numVotes ==  rooms[data.id].users.length){
    rooms[data.id].revealed = true;
  }else{
    rooms[data.id].revealed = false;
  }

  if(rooms[data.id].revealed){
    io.to(data.id).emit('updateVotes', rooms[data.id].votes);
  }

  socket.broadcast.to(data.id).emit('updateUsers', {users: rooms[data.id].users});
};

function onRevealVotes(io, socket, data){
  rooms[data.id].revealed = true;
  io.to(data.id).emit('updateVotes', rooms[data.id].votes);
};

function onClearSession(socket, data){
  rooms[data.id].users = _.map(rooms[data.id].users, function(u){ u.voted = false; return u;});
  rooms[data.id].votes = {};
  socket.broadcast.to(data.id).emit('clearVotes');
};

function onLeaveSession(socket){
  var roomId = _.findKey(rooms, function(room){
    return _.findWhere(room.users, {socketId: socket.id});
  });

  if(roomId && rooms[roomId].users.length > 1){
    rooms[roomId].users = _.reject(rooms[roomId].users, {socketId: socket.id});
    delete rooms[roomId].votes[socket.id];
    socket.broadcast.to(roomId).emit('updateUsers', {users: rooms[roomId].users});
    socket.broadcast.to(roomId).emit('updateVotes', rooms[roomId].votes);
  }else{
    delete rooms[roomId];
  }
};
