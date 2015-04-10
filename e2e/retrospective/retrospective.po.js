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
  this.userRow = element(by.repeater('player in players').row(0));

  this.shareUrl = element(by.model('url'));
  this.shareId = element(by.model('sessionId'));
  this.shareUrlBtn = element.all(by.css('.share .button')).first();
  this.shareIdBtn = element.all(by.css('.share .button')).last();
  this.shareTooltip = element(by.css('.share span.tooltip'));

  this.usernameInput_ = this.container.element(by.model('currentUser_.username'));
  this.sessionIdInput = this.container.element(by.model('sessionId'));
  this.joinBtn = element(by.buttonText('JOIN'));

  this.modal = element(by.css('.reveal-modal'));
  this.usernameModalInput = this.modal.element(by.model('username'));
  this.moderatorModalOpt = this.modal.element(by.cssContainingText('option', 'Moderator'));
  this.modalBtn = this.modal.element(by.buttonText('ENTER'));

  this.moderatorOpt = element(by.cssContainingText('form[name="startSessionForm"] option', 'Scrum Master \/ Moderator'));
  this.moderatorsList = element.all(by.repeater('moderator in moderators'));
  this.firstModerator= element(by.repeater('moderator in moderators').row(0).column('username'));

  this.retrospectiveOpt = element(by.cssContainingText('form[name="startSessionForm"] option', 'Retrospective Session'));

  this.goodColumn = element(by.cssContainingText('.retro .columns h2', 'More of...'));
  this.badColumn = element(by.cssContainingText('.retro .columns h2', 'Less of...'));
  this.improvementsColumn = element(by.cssContainingText('.retro .columns h2', 'Just as...'));

  this.addGoodBtn = element(by.css('[ng-click="toggleInputMode(\'good\')"]'));
  this.addBadBtn = element(by.css('[ng-click="toggleInputMode(\'bad\')"]'));
  this.addImpBtn = element(by.css('[ng-click="toggleInputMode(\'improvements\')"]'));

  this.newGoodEntry = element(by.model('newEntry.good'));
  this.newBadEntry = element(by.model('newEntry.bad'));
  this.newImpEntry = element(by.model('newEntry.improvements'));

  this.editEntry = this.modal.element(by.model('currentEntry.text'));
  this.showEntry = this.modal.element(by.css('#entry'));

  this.okBtn = this.modal.element(by.buttonText('OK'));
  this.closeBtn = this.modal.element(by.css('.close-reveal-modal'));
  this.closeBg = element(by.css('.reveal-modal-bg'));
  this.cancelBtn = this.modal.element(by.buttonText('CANCEL'));
  this.nextBtn = this.modal.element(by.buttonText('NEXT'));
  this.previousBtn = this.modal.element(by.buttonText('PREVIOUS'));

  this.showForOthers = element(by.model('showForOthers'));
  this.revealBtn = element(by.buttonText('REVEAL'));
  this.readBtn = element(by.buttonText('MARK AS READ'));
  this.unReadBtn = element(by.buttonText('MARK AS UNREAD'));

  this.goodLinkList = element.all(by.css('[ng-repeat="entry in session.good"] a'));
  this.badLinkList = element.all(by.css('[ng-repeat="entry in session.bad"] a'));
  this.impLinkList = element.all(by.css('[ng-repeat="entry in session.improvements"] a'));

  this.goodList = element.all(by.css('[ng-repeat="entry in session.good"] p'));
  this.badList = element.all(by.css('[ng-repeat="entry in session.bad"] p'));
  this.impList = element.all(by.css('[ng-repeat="entry in session.improvements"] p'));

  this.goodCheck = element.all(by.css('[ng-repeat="entry in session.good"] div .read'));

  this.goodEdit = element.all(by.css('[ng-repeat="entry in session.good"] div .fa-pencil'));
  this.badEdit = element.all(by.css('[ng-repeat="entry in session.bad"] div .fa-pencil'));
  this.impEdit = element.all(by.css('[ng-repeat="entry in session.improvements"] div .fa-pencil'));

  this.goodRemove = element.all(by.css('[ng-repeat="entry in session.good"] div .fa-trash'));
  this.badRemove = element.all(by.css('[ng-repeat="entry in session.bad"] div .fa-trash'));
  this.impRemove = element.all(by.css('[ng-repeat="entry in session.improvements"] div .fa-trash'));
};

module.exports = new MainPage();


