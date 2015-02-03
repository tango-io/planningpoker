/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.container = element(by.css('.main-content'));
  this.form = this.container.element(by.css('form[name="startSessionForm"]'));
  this.usernameInput = this.container.element(by.model('username'));

  this.usernameError = this.form.element(by.css('span.error'));
  this.startBtn = element(by.buttonText('Start'));

  this.modal = element(by.css('.reveal-modal h3'));
  this.modalBtn = element(by.css('.reveal-modal button'));

  this.goBtn = element(by.buttonText('Go ->'));

  this.usernameInput_ = this.container.element(by.model('username_'));
  this.sessionIdInput = this.container.element(by.model('sessionId'));
  this.joinBtn = element(by.buttonText('Join'));

  this.usernameError_ = element.all(by.css('form[name="joinSessionForm"] span.error')).first();
  this.sessionError = element.all(by.css('form[name="joinSessionForm"] span.error')).last();;

  this.playersList = element.all(by.repeater('player in players'));
  this.observersList = element.all(by.repeater('observer in observers'));
};

module.exports = new MainPage();

