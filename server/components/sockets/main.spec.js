'use strict';

var should = require('should');
var io = require('socket.io-client');
var _ = require('lodash');
var url = require('../../config/local.env').DOMAIN;

var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe('sockets', function() {

  var server, client1, client2;

  var options = {
    transports: ['websocket'],
    'force new connection': true,
    path: '/socket.io-client'
  };

  server = require('../../app').server;

  beforeEach(function (done) {
    client1 = io.connect(url, options);
    client2 = io.connect(url, options);

    client1.on('connect', function(data){
      client2.on('connect', function(data){
        done();
      });
    });
  });

  afterEach(function (done) {
    client1.disconnect();
    client2.disconnect();
    done();
  });

  it('emits an event when session is created', function(done) {
    client1.on('sessionCreated', function(sessionId){
      sessionId.should.match(/^.{8}-.{4}-.{4}-.{4}-.{12}/)
      done();
    });

    client1.emit('newSession');
  });

  it('emits an error event when session does not exist', function(done) {
    client1.emit('joinSession', {id:'not-existing-id'});

    client1.on('errorMsg', function(data){
      data.message.should.be.exactly("Session does not exist")
      done();
    });
  });

  it('emits an error if client does not send correct information', function(done) {
    client1.on('sessionCreated', function(sessionId){
      client2.emit('joinSession', {id:sessionId, username: 'tester'});

      client2.on('errorMsg', function(data){
        data.message.should.be.exactly("Missing information");
        done();
      });
    });

    client1.emit('newSession');
  });

  it('saves players and moderators', function(done) {
    client1.on('sessionCreated', function(sessionId){
      client1.emit('joinSession', {id: sessionId, username:'player1', userType: 'player'});

      client1.once('joinedSession', function(){
        client2.emit('joinSession', {id: sessionId, username:'moderator1', userType: 'moderator'});
        client2.once('joinedSession', function(){
          client2.on('updateUsers', function(data){
            data.players[0].username.should.be.exactly('player1');
            data.moderators[0].username.should.be.exactly('moderator1');
            done();
          });
        });
      });
    });
    client1.emit('newSession');
  });

  it('sends moderators and players list', function(done) {
    client1.emit('joinSession', {id:'not-existing-id'});

    client1.on('errorMsg', function(data){
      data.message.should.be.exactly("Session does not exist")
      done();
    });
  });

  it('emits hide votes when user joins in a session', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){

      client1.emit('joinSession', {id: id, username: 'Tester', userType: 'player'});

      client1.on('updateUsers', function(){
        client2.emit('joinSession', {id: id, username: 'Another tester', userType: 'player'});

        client1.on('hideVotes', function(data){
          done();
        });
      });
    });
  });

  it('emits update users when a user join in a session', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){

      client1.emit('joinSession', {id: id, username: 'Tester', userType: 'player'});

      client1.on('updateUsers', function(data){

        client2.emit('joinSession', {id: id, username: 'Another tester', userType: 'player'});
        client1.on('updateUsers', function(data){
          data.players[0].username.should.be.exactly('Tester');
          data.players[1].username.should.be.exactly('Another tester');
          done();
        })
      });
    });
  });

  it('updates description for all clients', function(done) {
    client1.emit('newSession');

    client1.on('sessionCreated', function(id){

      client1.emit('joinSession', {id: id, username: 'Tester', userType: 'player'});
      client2.emit('joinSession', {id: id, username: 'Another tester', userType: 'player'});

      client2.once('joinedSession', function(){
        client2.on('descriptionUpdated', function(data){
          data.should.be.exactly('Hello');
          done();
        });
        client1.emit('updateDescription', {id: id, description: 'Hello'});
      });
    });
  });

  it('updates vote flag when a user votes', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){
      client1.emit('joinSession', {id: id, username: 'Tester', userType:'player'});

      client1.once('updateUsers', function(data){
        client2.emit('joinSession', {id: id, username: 'Another tester', userType: 'player'});

        client2.once('updateUsers', function(data){

          client1.emit('vote', {id: id, userId: client1.id, vote: 3 });

          client2.once('updateUsers', function(data){
            data.players[0].voted.should.be.ok;
            done();
          });
        });
      });
    });
  });

  it('emits to reveal votes when all clients has voted', function(done) {
    client1.on('sessionCreated', function(id){
      client1.emit('joinSession', {id: id, username: 'Tester', userType: 'player'});
      client1.once('joinedSession', function(){
        client2.emit('joinSession', {id: id, username: 'Another tester', userType: 'player'});
        client2.once('joinedSession', function(){
          client2.on('updateVotes', function(data){
            data[client1.id].should.be.exactly(4);
            data[client2.id].should.be.exactly(5);
            done();
          });
          client1.emit('vote', {id: id, userId: client1.id, vote: 4 });
          client2.emit('vote', {id: id, userId: client2.id, vote: 5 });
        });
      });
    });
    client1.emit('newSession');
  });

  it('emits clear votes after clearing a session', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){

      client1.emit('joinSession', {id: id, username: 'Tester', userType: 'player'});
      client2.emit('joinSession', {id: id, username: 'Another tester', userType:'player'});

      client2.once('joinedSession', function(){
        client2.on('clearVotes', function(data){
          done();
        });
        client1.emit('clearSession', {id: id});
      });
    });
  });

  it('updates users after a client leaves', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){

      client1.emit('joinSession', {id: id, username: 'Tester', userType: 'player'});

      client1.once('updateUsers', function(data){
        client2.emit('joinSession', {id: id, username: 'Another tester', userType: 'player'});

        client1.once('updateUsers', function(data){
          client2.emit('leaveSession', {id: id, username: 'Another tester', userType: 'player'});

          client1.once('updateUsers', function(data){
            data.players.length.should.be.exactly(1);
            done();
          });
        });
      });
    });
  });

  it('updates votes after a client leaves', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){
      client1.emit('joinSession', {id: id, username: 'Tester', userType: 'player'});
      client2.emit('joinSession', {id: id, username: 'Another tester', userType: 'player'});

      client2.once('joinedSession', function(){
        client1.emit('vote', {id: id, userId: client1.id, vote: 7 });
        client2.emit('vote', {id: id, userId: client2.id, vote: 5 });

        client1.once('updateVotes', function(data){
          client1.on('updateVotes', function(data){
            var votesLength = _.keys(data).length
            votesLength.should.be.exactly(1);
            done();
          });

          client2.emit('leaveSession', {id: id, username: 'Another tester', userType: 'player'});
        });
      });
    });
  });
});
