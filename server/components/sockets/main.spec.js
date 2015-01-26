'use strict';

var should = require('should');
var io = require('socket.io-client');
var url = require('../../config/local.env').DOMAIN;
//var server = require('../../config/socketio');

var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe('sockets', function() {

  var server,

  options ={
    transports: ['websocket'],
    'force new connection': true
    path: '/socket.io-client'
  };

  beforeEach(function (done) {
    server = require('../../app').server;
    done();
  });


  it('emits an event when session is created', function(done) {
    var client = io.connect(url, options);

    client.on('connect', function(data){
        console.log("________________", sessionID);
      client.emit('newSession')
      done();
    });

      client.on('newSession', function(sessionID){
        console.log("________________", sessionID);
        client1.disconnect();
        done();
      });
    //client.on('sessionCreated',function(sessionId){
    //  //usersName.should.be.type('string');
    //  //usersName.should.equal(chatUser1.name + " has joined.");
    //  console.log("aklsjdalsd", sessionId);
    //  client.disconnect();
    //});
    //client1.send('newSession');
  });

  //it('emits update users when a user join in a session', function(done) {
      //var client1 = io.connect(url);

      //client1.send('newSession', client1);
      //client2.on('connect', function(data){
      //  client2.emit('connection name', chatUser2);
      //});

  //});

  //it('emits hide votes when user joins in a session', function(done) {
  //});

  //it('emits an error event when session does not exist', function(done) {
  //});

  //it('updates description for all clients', function(done) {
  //});

  //it('updates votes for all clients', function(done) {
  //});

  //it('emits to reveal votes when all clients has voted', function(done) {
  //});

  //it('emits clear votes after clearing a session', function(done) {
  //});

  //it('updates users and votes after a client leaves', function(done) {
  //});
});

