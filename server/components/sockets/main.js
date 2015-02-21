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
  socket.on('newMessage', function(data){onNewMessagge(socket, data);});
  socket.on('reveal', function(data){onReveal(io, data);});
  socket.on('hide', function(data){onHide(io, data);});
  socket.on('openEntry', function(data){onOpenEntry(socket, data);});
  socket.on('closeEntry', function(data){onCloseEntry(socket, data);});
  socket.on('updateEntry', function(data){onUpdateEntry(socket, data);});
  socket.on('disconnect', function(data){onLeaveSession(socket);});
};
function onNewSession(socket, data) {
  var roomId = uuid.v1();
  if(data == 'retrospective'){
    rooms[roomId] = {players: [], moderators:[], good: [], bad: [], improvements: []};
  }else{
    rooms[roomId] = {players: [], moderators:[], votes: {}, voteValues: data};
  }
  socket.emit('sessionCreated', roomId);
};

function onJoinSession(io, socket, data) {
  //if(!rooms[data.roomId]){ return socket.emit('errorMsg', {message: "Session does not exist"}); }
  if(!rooms[data.roomId]){
    var roomId = uuid.v1();
    rooms[roomId] = {players: [], moderators:[], good: [], bad: [], improvements: []};
  }

  if(!data.username || !data.type){ return socket.emit('errorMsg', {message: "Missing information"}); }

  socket.join(data.roomId);
  //Save user in room
  rooms[data.roomId][data.type + "s"].push({id: socket.id, username:data.username, type:data.type});

  //Send previous information from room
  //if(data.sessionType == 'retrospective'){
    socket.emit('joinedSession', {id: socket.id, session: getRetrospectiveData(rooms[data.roomId])});
    io.to(data.roomId).emit('updateUsers', {players: rooms[data.roomId].players, moderators: rooms[data.roomId].moderators});
  //}else{
  //  socket.emit('joinedSession', {id: socket.id, description: rooms[data.roomId].description, voteValues: rooms[data.roomId].voteValues});

  //  io.to(data.roomId).emit('hideVotes'); //hide votes if more users joined to room
  //  io.to(data.roomId).emit('updateUsers', {players: rooms[data.roomId].players, moderators: rooms[data.roomId].moderators});
  //}
};

//function updateDescription(socket, data) {
//  rooms[data.id].description = data.description;
//  socket.broadcast.to(data.id).emit('descriptionUpdated', data.description);
//};

//function onVote(io, socket, data) {
//  var user = _.findWhere(rooms[data.id].players, {id: data.userId});
//  rooms[data.id].votes[data.userId] = data.vote;
//  user.voted = true;

//  var numVotes = _.groupBy(rooms[data.id].players, 'voted').true.length;

//  //Reveal votes if all user has voted
//  rooms[data.id].revealed = numVotes ==  rooms[data.id].players.length;
//  if(rooms[data.id].revealed){ io.to(data.id).emit('updateVotes', rooms[data.id].votes); }

//  //update users to see what users already vote
//  socket.broadcast.to(data.id).emit('updateUsers', {players: rooms[data.id].players, moderators: rooms[data.id].moderators});
//};

//function onRevealVotes(io, socket, data){
//  rooms[data.id].revealed = true;
//  io.to(data.id).emit('updateVotes', rooms[data.id].votes);
//};

//function onClearSession(socket, data){
//  rooms[data.id].players = _.map(rooms[data.id].players, function(u){ u.voted = false; return u;});
//  rooms[data.id].votes = {};
//  socket.broadcast.to(data.id).emit('clearVotes');
//};

function getRetrospectiveData(data){
  return {good: hideText(data.good), bad: hideText(data.bad), improvements: hideText(data.improvements)}
};

function hideText(data){
   var entry;
   return _.map(data, function(value){
    entry = _.clone(value);
    entry.text = '________ (' + entry.username + ')';
    return entry;
  }) || [];
};

function onNewMessagge(socket, data) {
  rooms[data.id][data.type].push({username: data.username, disabled:true,  text: data.text, id: socket.id});
  socket.broadcast.to(data.id).emit('newMessage', {type: data.type, username: data.username});
};

function onReveal(io, data) {
  io.to(data.id).emit('reveal', {session: _.pick(rooms[data.id], 'good', 'bad', 'improvements')} );
};

function onHide(io, data) {
  io.to(data.id).emit('hide', {session: getRetrospectiveData(rooms[data.id])} );
};

function onOpenEntry(socket, data) {
  socket.broadcast.to(data.id).emit('openEntry', {entry: data.entry});
};

function onCloseEntry(socket, data) {
  socket.broadcast.to(data.id).emit('closeEntry');
};

function onUpdateEntry(socket, data) {
  var o = _.pick(rooms[data.id], 'good', 'bad', 'improvements');
  var a = _.union(o.good, o.bad, o.improvements);
  var entry = _.findWhere(a, {text: data.entry.text});
  entry.read = data.entry.read;
  entry.text = data.entry.text;
  socket.broadcast.to(data.id).emit('entryUpdated', entry);
};

function onLeaveSession(socket){
  var match, union;
  var roomId = _.findKey(rooms, function(room){//Find user in rooms
    union = _.union(room.players, room.moderators);
    match = _.findWhere(union, {id: socket.id});
    if(match){ return room;}
  });

  if(roomId && union.length > 1){ //Remove user from rooms and delete rooms if is the last user in the room
    rooms[roomId][match.type + "s"]= _.reject(rooms[roomId][match.type + "s"], {id: socket.id}); //remove user from room
    socket.broadcast.to(roomId).emit('updateUsers', {players: rooms[roomId].players, moderators: rooms[roomId].moderators});
    if(match.type == 'player' && rooms[roomId].votes){ //delete votes from user, and update clients
      delete rooms[roomId].votes[socket.id];
      socket.broadcast.to(roomId).emit('updateVotes', rooms[roomId].votes);
    }
  }else{
    delete rooms[roomId];
  }
};
