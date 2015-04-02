/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.container = element(by.css('#container'));
  this.form = this.container.element(by.css('form[name="startSessionForm"]'));

  this.usernameInput = this.container.element(by.model('currentUser.username'));
  this.startBtn = element(by.buttonText('Start'));

  this.userList = element.all(by.repeater('player in players'));
  this.votesList = element.all(by.repeater('vote in voteValues'));
  this.userRow = element(by.repeater('player in players').row(0));

  this.shareUrl = element(by.model('url'));
  this.shareId = element(by.model('sessionId'));
  this.shareUrlBtn = element.all(by.css('.share .button')).first();
  this.shareIdBtn = element.all(by.css('.share .button')).last();
  this.shareTooltip = element(by.css('.share span.tooltip'));

  this.numbers = element(by.repeater('vote in voteValues').row(0));

  this.number = element(by.repeater('vote in voteValues').row(0).column('vote'));

  this.statics = element(by.css('.statics'));
  this.staticsList = element.all(by.repeater('(point, votes) in points'));
  this.staticsRow = element(by.repeater('(point, votes) in points').row(0));

  this.descriptionInput = element(by.model('description'));

  this.usernameInput_ = this.container.element(by.model('currentUser_.username'));
  this.sessionIdInput = this.container.element(by.model('sessionId'));
  this.joinBtn = element(by.buttonText('Join'));

  this.clearBtn = element(by.buttonText('Play Again'));
  this.goBtn = element(by.buttonText('Go'));

  this.modal = element(by.css('.reveal-modal'));
  this.modalBg = element(by.css('.reveal-modal-bg'));
  this.usernameModalInput = this.modal.element(by.model('username'));
  this.moderatorModalOpt = this.modal.element(by.cssContainingText('option', 'Moderator'));
  this.modalBtn = this.modal.element(by.buttonText('OK'));

 this.moderatorOpt = element(by.cssContainingText('.start option', 'Scrum Master \/ Moderator'));
 this.moderatorsList = element.all(by.repeater('moderator in moderators'));
 this.firstModerator= element(by.repeater('moderator in moderators').row(0).column('username'));
 this.numbersList = element(by.css('[ng-repeat = "vote in voteValues]"'));
};

module.exports = new MainPage();


