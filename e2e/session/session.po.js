/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.container = element(by.css('#container'));
  this.form = this.container.element(by.css('form[name="startSessionForm"]'));

  this.usernameInput = this.container.element(by.model('currentUser.username'));
  this.startBtn = element(by.buttonText('START'));

  this.userList = element.all(by.repeater('player in players'));
  this.votesList = element.all(by.repeater('vote in voteValues'));
  this.userRow = element(by.repeater('player in players').row(0));

  this.shareUrl = element(by.model('url'));
  this.shareId = element(by.model('sessionId'));
  this.shareUrlBtn = element(by.css('#share-url'));
  this.shareIdBtn = element(by.css('#share-id'));
  this.shareTooltip = element(by.css('.share span.tooltip'));

  this.numbers = element(by.repeater('vote in voteValues').row(0));

  this.number = this.numbers.element(by.css('span'));

  this.statics = element(by.css('.results'));
  this.staticsList = element.all(by.repeater('(point, votes) in points'));
  this.staticsRow = element(by.repeater('(point, votes) in points').row(0));

  this.descriptionInput = element(by.model('description'));

  this.usernameInput_ = this.container.element(by.model('currentUser_.username'));
  this.sessionIdInput = this.container.element(by.model('sessionId'));
  this.joinBtn = element(by.buttonText('JOIN'));

  this.clearBtn = element(by.buttonText('PLAY AGAIN'));
  this.goBtn = element(by.cssContainingText('.values button', 'START'));

  this.modal = element(by.css('.reveal-modal'));
  this.modalBg = element(by.css('.reveal-modal-bg'));
  this.usernameModalInput = this.modal.element(by.model('username'));
  this.moderatorModalOpt = this.modal.element(by.cssContainingText('option', 'Moderator'));
  this.modalBtn = element(by.css('.reveal-modal button'));

  this.moderatorOpt = element(by.cssContainingText('form[name="startSessionForm"] option', 'Scrum Master \/ Moderator'));
  this.moderatorsList = element.all(by.repeater('moderator in moderators'));
  this.firstModerator= element(by.repeater('moderator in moderators').row(0).column('username'));
  this.numbersList = element(by.css('[ng-repeat = "vote in voteValues]"'));
};

module.exports = new MainPage();
