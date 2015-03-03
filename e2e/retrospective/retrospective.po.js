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
  this.userRow = element(by.repeater('player in players').row(0));

  this.shareUrl = element(by.model('url'));
  this.shareId = element(by.model('sessionId'));
  this.shareUrlBtn = element.all(by.css('.share .button')).first();
  this.shareIdBtn = element.all(by.css('.share .button')).last();
  this.shareTooltip = element(by.css('.share span.tooltip'));

  this.usernameInput_ = this.container.element(by.model('currentUser_.username'));
  this.sessionIdInput = this.container.element(by.model('sessionId'));
  this.joinBtn = element(by.buttonText('Join'));

  this.modal = element(by.css('.reveal-modal'));
  this.usernameModalInput = this.modal.element(by.model('username'));
  this.moderatorModalOpt = this.modal.element(by.cssContainingText('option', 'Moderator'));
  this.modalBtn = this.modal.element(by.buttonText('OK'));

 this.moderatorOpt = element(by.cssContainingText('.start option', 'Scrum Master \/ Moderator'));
 this.moderatorsList = element.all(by.repeater('moderator in moderators'));
 this.firstModerator= element(by.repeater('moderator in moderators').row(0).column('username'));

 this.retrospectiveOpt = element(by.cssContainingText('.start option', 'Retrospective'));
 this.retrospectiveJoinOpt = element(by.cssContainingText('.join option', 'Retrospective'));

 this.goodColumn = element(by.cssContainingText('.retrospective .columns h5', 'Prouds'));
 this.badColumn = element(by.cssContainingText('.retrospective .columns h5', 'Sorries'));
 this.improvementsColumn = element(by.cssContainingText('.retrospective .columns h5', 'Ideas'));

 this.addGoodBtn = element(by.css('[ng-click="toggleInputMode(\'good\')"]'));
 this.addBadBtn = element(by.css('[ng-click="toggleInputMode(\'bad\')"]'));
 this.addImpBtn = element(by.css('[ng-click="toggleInputMode(\'improvements\')"]'));

 this.newGoodEntry = element(by.model('newEntry.good'));
 this.newBadEntry = element(by.model('newEntry.bad'));
 this.newImpEntry = element(by.model('newEntry.improvements'));

 this.editEntry = this.modal.element(by.model('currentEntry.text'));
 this.showEntry = this.modal.element(by.model('currentEntry.text'));

 this.okBtn = this.modal.element(by.buttonText('OK'));
 this.closeBtn = this.modal.element(by.buttonText('Close'));
 this.cancelBtn = this.modal.element(by.buttonText('Cancel'));
 this.nextBtn = this.modal.element(by.buttonText('Next'));
 this.previousBtn = this.modal.element(by.buttonText('Previous'));

 this.revealBtn = element(by.buttonText('Reveal'));
 this.readBtn = element(by.buttonText('Mark as read'));
 this.unReadBtn = element(by.buttonText('Mark as unread'));

 this.goodLinkList = element.all(by.css('[ng-repeat="entry in session.good"] a'));
 this.badLinkList = element.all(by.css('[ng-repeat="entry in session.bad"] a'));
 this.impLinkList = element.all(by.css('[ng-repeat="entry in session.improvements"] a'));

 this.goodList = element.all(by.css('[ng-repeat="entry in session.good"] span'));
 this.badList = element.all(by.css('[ng-repeat="entry in session.bad"] span'));
 this.impList = element.all(by.css('[ng-repeat="entry in session.improvements"] span'));

 this.goodCheck = element.all(by.css('[ng-repeat="entry in session.good"] div .fa-check'));

 this.goodEdit = element.all(by.css('[ng-repeat="entry in session.good"] div .fa-pencil'));
 this.badEdit = element.all(by.css('[ng-repeat="entry in session.bad"] div .fa-pencil'));
 this.impEdit = element.all(by.css('[ng-repeat="entry in session.improvements"] div .fa-pencil'));

 this.goodRemove = element.all(by.css('[ng-repeat="entry in session.good"] div .fa-times'));
 this.badRemove = element.all(by.css('[ng-repeat="entry in session.bad"] div .fa-times'));
 this.impRemove = element.all(by.css('[ng-repeat="entry in session.improvements"] div .fa-times'));
};

module.exports = new MainPage();


