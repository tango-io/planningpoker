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
    client1.on('sessionCreated', function(data){
      data.id.should.match(/^.{8}-.{4}-.{4}-.{4}-.{12}/)
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
    client1.on('sessionCreated', function(data){
      client2.emit('joinSession', {roomId:data.id, username: 'tester'});

      client2.on('errorMsg', function(data){
        data.message.should.be.exactly("Missing information");
        done();
      });
    });
    client1.emit('newSession');
  });

  it('saves players and moderators', function(done) {
    client1.on('sessionCreated', function(data){
      client1.emit('joinSession', {roomId: data.id, username:'player1', type: 'player'});

      client1.once('joinedSession', function(){
        client2.emit('joinSession', {roomId: data.id, username:'moderator1', type: 'moderator'});
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
    client1.on('sessionCreated', function(data){

      client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player'});

      client1.on('updateUsers', function(){

        client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type: 'player'});
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
    client1.on('sessionCreated', function(data){

      client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player'});

      client1.once('updateUsers', function(){
        client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type: 'player'});

        client1.once('updateUsers', function(){
          client2.emit('leaveSession', {roomId: data.id, username: 'Another tester', type: 'player'});

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
      client1.on('sessionCreated', function(data){

        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player'});

        client1.on('updateUsers', function(){
          client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type: 'player'});

          client1.on('hideVotes', function(data){
            done();
          });
        });
      });
    });

    it('updates description for all clients', function(done) {
      client1.emit('newSession');

      client1.on('sessionCreated', function(data){

        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player'});
        client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type: 'player'});

        client2.once('joinedSession', function(){
          client2.on('descriptionUpdated', function(data){
            data.should.be.exactly('Hello');
            done();
          });
          client1.emit('updateDescription', {id: data.id, description: 'Hello'});
        });
      });
    });

    it('updates vote flag when a user votes', function(done) {
      client1.emit('newSession');
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type:'player'});

        client1.once('updateUsers', function(){
          client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type: 'player'});

          client2.once('updateUsers', function(){

            client1.emit('vote', {id: data.id, userId: client1.id, vote: 3 });

            client2.once('updateUsers', function(data){
              data.players[0].voted.should.be.ok;
              done();
            });
          });
        });
      });
    });

    it('emits to reveal votes when all clients has voted', function(done) {
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player'});
        client1.once('joinedSession', function(){
          client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type: 'player'});
          client2.once('joinedSession', function(){
            client2.on('updateVotes', function(data){
              data[client1.id].should.be.exactly(4);
              data[client2.id].should.be.exactly(5);
              done();
            });
            client1.emit('vote', {id: data.id, userId: client1.id, vote: 4 });
            client2.emit('vote', {id: data.id, userId: client2.id, vote: 5 });
          });
        });
      });
      client1.emit('newSession');
    });

    it('emits clear votes after clearing a session', function(done) {
      client1.emit('newSession');
      client1.on('sessionCreated', function(data){

        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player'});
        client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type:'player'});

        client2.once('joinedSession', function(){
          client2.on('clearVotes', function(data){
            done();
          });
          client1.emit('clearSession', {id: data.id});
        });
      });
    });

    it('updates votes after a client leaves', function(done) {
      client1.emit('newSession');
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player'});
        client2.emit('joinSession', {roomId: data.id, username: 'Another tester', type: 'player'});

        client2.once('joinedSession', function(){
          client1.emit('vote', {id: data.id, userId: client1.id, vote: 7 });
          client2.emit('vote', {id: data.id, userId: client2.id, vote: 5 });

          client1.once('updateVotes', function(data){
            client1.on('updateVotes', function(data){
              var votesLength = _.keys(data).length
              votesLength.should.be.exactly(1);
              done();
            });

            client2.emit('leaveSession', {id: data.id, username: 'Another tester', type: 'player'});
          });
        });
      });
    });
  });

  describe('Retrospective session events', function(){
    it('set default values in new sessionlistener', function(done) {

      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
      });

      client1.on('joinedSession', function(data){
        data.session.should.have.property('good').with.lengthOf(0);
        data.session.should.have.property('bad').with.lengthOf(0);
        data.session.should.have.property('improvements').with.lengthOf(0);
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('emits new entry entry on corresponding type in new entry', function(done) {
      var id;

      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('newEntry', {id: id, type:'good', entry:{ username: 'Tester', text:'Test'}});
      });

      client2.on('newEntry', function(data){
        data.type.should.be.exactly('good');
        data.username.should.be.exactly('Tester');
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('emits reveal on reveal function', function(done) {
      var id;

      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('newEntry', {id: id, type:'good', entry:{ username: 'Tester', text:'TestG'}});
        client1.emit('newEntry', {id: id, type:'bad', entry:{ username: 'Tester', text:'TestB'}});
        client1.emit('newEntry', {id: id, type:'improvements', entry:{ username: 'Tester', text:'TestI'}});
        client1.emit('reveal', {id: id, type:'good', entry:{ username: 'Tester', text:'Test'}});
      });

      client2.on('reveal', function(data){
        data.session.good[0].should.have.property('username', 'Tester');
        data.session.good[0].should.have.property('text', 'TestG');
        data.session.good[0].should.have.property('userId', client1.id);
        data.session.bad[0].should.have.property('text', 'TestB');
        data.session.improvements[0].should.have.property('text', 'TestI');
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('emits hide on hide function', function(done) {
      var id;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('hide', {id: id, type:'good', entry: {id: 0}});
      });

      client2.on('hide', function(data){
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('emits remove on remove function', function(done) {
      var id;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('newEntry', {id: id, type:'good', entry:{username: 'Tester', text:'TestG', id:0}});
        client1.emit('deleteEntry', {id: id, type:'good', entry: {id: 0}});
      });

      client2.on('deleteEntry', function(data){
        data.should.have.property('id', id);
        data.should.have.property('type', 'good');
        data.entry.should.have.property('id', 0);
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('emits open entry on open entry function', function(done) {
      var id;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('openEntry', {id: id, type:'good', entry: {id: 0}});
      });

      client2.on('openEntry', function(data){
        data.entry.should.have.property('id', 0);
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('emits close entry on close entry function', function(done) {
      var id;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('closeEntry', {id: id});
      });

      client2.on('closeEntry', function(data){
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('emits move current entry on current entry function', function(done) {
      var id;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('moveCurrentEntry', {id: id, type: 'good', entry:{ id: 0}});
      });

      client2.on('moveCurrentEntry', function(data){
        data.should.have.property('type', 'good');
        data.entry.should.have.property('id', 0);
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('update and emits update entry on update function', function(done) {
      var id;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('newEntry', {id: id, type:'good', entry:{username: 'Tester', text:'TestG', id:0}});
        client1.emit('updateEntry', {id: id, entryType: 'good', entry:{ id: 0, read: true}});
      });

      client2.on('entryUpdated', function(data){
        data.should.have.property('entryType', 'good');
        data.entry.should.have.property('read', true);
        data.entry.should.have.property('id', 0);
        done();
      });

      client1.emit('newSession', 'retrospective');
    });

    it('removes entries from user on leave session', function(done) {
      var id, pass;
      var that = this;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client1.on('joinedSession', function(data){
        client1.emit('newEntry', {id: id, type:'good', entry:{username: 'Tester', text:'TestG', id:0}});
        client1.emit('leaveSession', {id: id, entryType: 'good', entry:{ id: 0, read: true}});

        client2.on('updateEntries', function(data){
          data.good.length.should.be.exactly(0);
          done();
        });
      });

      client1.emit('newSession', 'retrospective');
    });

    it('removes users from user on leave session', function(done) {
      var id, pass;
      var that = this;
      client1.on('sessionCreated', function(data){
        client1.emit('joinSession', {roomId: data.id, username: 'Tester', type: 'player', sessionType: 'retrospective'});
        client2.emit('joinSession', {roomId: data.id, username: 'Tester2', type: 'player', sessionType: 'retrospective'});
        id = data.id;
      });

      client2.once('updateUsers', function(data){
        client1.on('joinedSession', function(data){
          client1.emit('newEntry', {id: id, type:'good', entry:{username: 'Tester', text:'TestG', id:0}});
          client1.emit('leaveSession', {id: id, entryType: 'good', entry:{ id: 0, read: true}});

          client2.once('updateUsers', function(data){
            data.players.length.should.be.exactly(1);
            done();
          });

        });
      });
      client1.emit('newSession', 'retrospective');
    });
  });
});
