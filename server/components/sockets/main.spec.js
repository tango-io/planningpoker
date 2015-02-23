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
      client2.emit('joinSession', {roomId:sessionId, username: 'tester'});

      client2.on('errorMsg', function(data){
        data.message.should.be.exactly("Missing information");
        done();
      });
    });
    client1.emit('newSession');
  });

  it('saves players and moderators', function(done) {
    client1.on('sessionCreated', function(sessionId){
      client1.emit('joinSession', {roomId: sessionId, username:'player1', type: 'player'});

      client1.once('joinedSession', function(){
        client2.emit('joinSession', {roomId: sessionId, username:'moderator1', type: 'moderator'});
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
    client1.emit('joinSession', {roomId:'not-existing-id'});

    client1.on('errorMsg', function(data){
      data.message.should.be.exactly("Session does not exist")
      done();
    });
  });

  it('emits update users when a user join in a session', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){

      client1.emit('joinSession', {roomId: id, username: 'Tester', type: 'player'});

      client1.on('updateUsers', function(data){

        client2.emit('joinSession', {roomId: id, username: 'Another tester', type: 'player'});
        client1.on('updateUsers', function(data){
          data.players[0].username.should.be.exactly('Tester');
          data.players[1].username.should.be.exactly('Another tester');
          done();
        })
      });
    });
  });

  it('updates users after a client leaves', function(done) {
    client1.emit('newSession');
    client1.on('sessionCreated', function(id){

      client1.emit('joinSession', {roomId: id, username: 'Tester', type: 'player'});

      client1.once('updateUsers', function(data){
        client2.emit('joinSession', {roomId: id, username: 'Another tester', type: 'player'});

        client1.once('updateUsers', function(data){
          client2.emit('leaveSession', {roomId: id, username: 'Another tester', type: 'player'});

          client1.once('updateUsers', function(data){
            data.players.length.should.be.exactly(1);
            done();
          });
        });
      });
    });
  });

  describe('Pointing session events', function(){

    it('emits hide votes when user joins in a session', function(done) {
      client1.emit('newSession');
      client1.on('sessionCreated', function(id){

        client1.emit('joinSession', {roomId: id, username: 'Tester', type: 'player'});

        client1.on('updateUsers', function(){
          client2.emit('joinSession', {roomId: id, username: 'Another tester', type: 'player'});

          client1.on('hideVotes', function(data){
            done();
          });
        });
      });
    });

    it('updates description for all clients', function(done) {
      client1.emit('newSession');

      client1.on('sessionCreated', function(id){

        client1.emit('joinSession', {roomId: id, username: 'Tester', type: 'player'});
        client2.emit('joinSession', {roomId: id, username: 'Another tester', type: 'player'});

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
        client1.emit('joinSession', {roomId: id, username: 'Tester', type:'player'});

        client1.once('updateUsers', function(data){
          client2.emit('joinSession', {roomId: id, username: 'Another tester', type: 'player'});

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
        client1.emit('joinSession', {roomId: id, username: 'Tester', type: 'player'});
        client1.once('joinedSession', function(){
          client2.emit('joinSession', {roomId: id, username: 'Another tester', type: 'player'});
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

        client1.emit('joinSession', {roomId: id, username: 'Tester', type: 'player'});
        client2.emit('joinSession', {roomId: id, username: 'Another tester', type:'player'});

        client2.once('joinedSession', function(){
          client2.on('clearVotes', function(data){
            done();
          });
          client1.emit('clearSession', {id: id});
        });
      });
    });

    it('updates votes after a client leaves', function(done) {
      client1.emit('newSession');
      client1.on('sessionCreated', function(id){
        client1.emit('joinSession', {roomId: id, username: 'Tester', type: 'player'});
        client2.emit('joinSession', {roomId: id, username: 'Another tester', type: 'player'});

        client2.once('joinedSession', function(){
          client1.emit('vote', {id: id, userId: client1.id, vote: 7 });
          client2.emit('vote', {id: id, userId: client2.id, vote: 5 });

          client1.once('updateVotes', function(data){
            client1.on('updateVotes', function(data){
              var votesLength = _.keys(data).length
              votesLength.should.be.exactly(1);
              done();
            });

            client2.emit('leaveSession', {id: id, username: 'Another tester', type: 'player'});
          });
        });
      });
    });
  });

  describe('Retrospective session events', function(){
    it('set default values in new sessionlistener', function(done) {
    });

    it('emits joined session and update users in join session', function(done) {
    });

    it('saves entry on corresponding type in new entry', function(done) {
    });

    it('emits new entry on new entry function', function(done) {
    });

    it('emits reveal on reveal function', function(done) {
    });

    it('emits hide on hide function', function(done) {
    });

    it('emits remove on remove function', function(done) {
    });

    it('removes entry on remove function', function(done) {
    });

    it('emits open entry on open entry function', function(done) {
    });

    it('emits close entry on close entry function', function(done) {
    });

    it('emits move current entry on current entry function', function(done) {
    });

    it('remove and emits remove on remove function', function(done) {
    });

    it('update and emits update entry on update function', function(done) {
    });

    it('removes users and entries from user on leave session', function(done) {
    });
  });
});
