'use strict';

var uuid  = require('node-uuid'),
    _     = require('lodash'),
    rooms = {};

exports.register = function(socket, io) {
  socket.on('newSession', function(data){ onNewSession(socket, data);});
  socket.on('joinSession', function(data){ onJoinSession(io, socket, data);});
  socket.on('updateDescription', function(data){ updateDescription(socket, data);});
  socket.on('vote', function(data){ onVote(io, socket, data);});
  socket.on('revealVotes', function(data){onRevealVotes(io, socket, data);});
  socket.on('clearSession', function(data){onClearSession(socket, data)});
  socket.on('leaveSession', function(data){onLeaveSession(socket);});
  socket.on('disconnect', function(data){onLeaveSession(socket);});
};

function onNewSession(socket, data) {
  var roomid = uuid.v1();
  rooms[roomid] = {players: [], observers:[], votes: {}, voteValues: data};
  socket.emit('sessionCreated', roomid);
};

function onJoinSession(io, socket, data) {
  if(!rooms[data.id]){ return socket.emit('errorMsg', {message: "Session does not exist"}); }
  if(!data.username || !data.userType){ return socket.emit('errorMsg', {message: "Missing information"}); }

  socket.join(data.id);
  var userTypes = { player: "players", observer: "observers" }
  rooms[data.id][userTypes[data.userType]].push({username: data.username, userType: data.userType, socketId: socket.id});
  socket.emit('joinedSession', {id: socket.id, userType: data.userType, description: rooms[data.id].description, voteValues: rooms[data.id].voteValues});

  io.to(data.id).emit('hideVotes');
  io.to(data.id).emit('updateUsers', {players: rooms[data.id].players, observers: rooms[data.id].observers});
};

function updateDescription(socket, data) {
  rooms[data.id].description = data.description;
  socket.broadcast.to(data.id).emit('descriptionUpdated', data.description);
};

function onVote(io, socket, data) {
  var user = _.findWhere(rooms[data.id].players, {socketId: data.userId});
  user.voted = true;
  rooms[data.id].votes[data.userId] = data.vote;

  var numVotes = _.groupBy(rooms[data.id].players, 'voted').true.length;

  //if all user has voted
  rooms[data.id].revealed = numVotes ==  rooms[data.id].players.length;
  if(rooms[data.id].revealed){ io.to(data.id).emit('updateVotes', rooms[data.id].votes); }

  socket.broadcast.to(data.id).emit('updateUsers', {players: rooms[data.id].players, observers: rooms[data.id].observers});
};

function onRevealVotes(io, socket, data){
  rooms[data.id].revealed = true;
  io.to(data.id).emit('updateVotes', rooms[data.id].votes);
};

function onClearSession(socket, data){
  rooms[data.id].players = _.map(rooms[data.id].players, function(u){ u.voted = false; return u;});
  rooms[data.id].votes = {};
  socket.broadcast.to(data.id).emit('clearVotes');
};

function onLeaveSession(socket){
  var roomId = _.findKey(rooms, function(room){
    return _.findWhere(room.players, {socketId: socket.id});
  });

  if(roomId && rooms[roomId].players.length > 1){
    rooms[roomId].players = _.reject(rooms[roomId].players, {socketId: socket.id});
    delete rooms[roomId].votes[socket.id];
    socket.broadcast.to(roomId).emit('updateUsers', {players: rooms[roomId].players, observers: rooms[roomId].observers});
    socket.broadcast.to(roomId).emit('updateVotes', rooms[roomId].votes);
  }else{
    delete rooms[roomId];
  }
};
