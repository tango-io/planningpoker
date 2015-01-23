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
  this.startBtn = this.form.element(by.css('button'));

  this.modal = element(by.css('.reveal-modal h3'));
  this.modalBtn = element(by.css('.reveal-modal button'));


  this.usernameInput_ = this.container.element(by.model('username_'));
  this.sessionIdInput = this.container.element(by.model('sessionId'));
  this.joinBtn = this.container.element(by.css('form[name="joinSessionForm"] button'));

  this.usernameError_ = element.all(by.css('form[name="joinSessionForm"] span.error')).first();
  this.sessionError = element.all(by.css('form[name="joinSessionForm"] span.error')).last();;




  this.usernameText = element(by.css('h5.ng-binding'));;
  this.userList = element.all(by.repeater('user in users'));
  this.userRow = element(by.repeater('user in users').row(0));
  this.shareLink = element.all(by.css('.share a')).first();
};

module.exports = new MainPage();


