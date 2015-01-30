/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.container = element(by.css('.main-content'));
  this.form = this.container.element(by.css('form[name="startSessionForm"]'));

  this.usernameInput = this.container.element(by.model('username'));
  this.startBtn = this.form.element(by.css('button'));

  //this.voteListRow = element(by.repeater('vote in voteValues').row(0).column('vote.value'));
  this.voteList = element.all(by.repeater('vote in voteValues'));
  this.voteListFirstLabel = element(by.css('tr:first-child td:first-child input'));
  this.voteListFirstValue = element(by.css('tr:first-child td:nth-child(2) input'));
  this.voteListFirstBtn = element(by.css('tr:first-child td:last-child button'));

  this.newVoteLabel = element(by.css('tr:last-child td:first-child input'));
  this.newVoteValue = element(by.css('tr:last-child td:nth-child(2) input'));
  this.voteAddBtn = element(by.css('tr:last-child td:last-child button'));

  this.voteListFirst = element(by.css('ul.button-group li:first-child button'));
  this.votesFirst = element(by.css('tr[ng-repeat="user in users"] td:last-child'));

  this.usernameInput_ = this.container.element(by.model('username_'));
  this.sessionIdInput = this.container.element(by.model('sessionId'));
  this.joinBtn = this.container.element(by.css('form[name="joinSessionForm"] button'));

  this.clearBtn = element(by.buttonText('Clear Votes'));
  this.showBtn = element(by.buttonText('Show Votes'));
  this.goBtn = element(by.buttonText('Go ->'));

  this.modal = element(by.css('.reveal-modal'));
  this.usernameModalInput = this.modal.element(by.model('username'));
  this.modalBtn = this.modal.element(by.buttonText('OK'));
};

module.exports = new MainPage();


