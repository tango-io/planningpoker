'use strict';

var config = require('../../server/config/local.env');

describe('Session View', function() {
  var page;
  var id;

  beforeEach(function() {
    page = require('./session.po');
    browser.get('/');
    browser.waitForAngular();

    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    page.goBtn.click();
    browser.sleep(3000);
    browser.getCurrentUrl().then(function(url){
      id = url.split('/')[5];
      expect(url).toMatch('#/sessions/');
    });
  });

  it('s able to show data after entering a session', function() {
    expect(page.usernameText.getText()).toEqual("Your username: Arya");
    expect(page.userList.count()).toEqual(1);
    expect(page.userRow.getText()).toEqual('Arya');
    browser.getCurrentUrl().then(function(url){
      expect(page.shareLink.getText()).toEqual(url);
    });
  });

  it('s able to view moderator and players list', function(){
    browser.get('/');
    browser.waitForAngular();
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    page.goBtn.click();
    browser.sleep(3000);
    expect(page.userList.count()).toBe(1);

    browser.get('/');
    browser.waitForAngular();
    page.usernameInput.sendKeys('Arya');
    page.moderatorOpt.click();
    page.startBtn.click();
    page.goBtn.click();
    browser.sleep(3000);
    expect(page.moderatorsList.count()).toBe(1);
  });

  it('s prompts username request if user does not have', function(){
    browser.getCurrentUrl().then(function(url){
      browser.get(url);
      expect(page.usernameModalInput.isDisplayed()).toBe(true);
      page.usernameModalInput.sendKeys('Cersei');
      page.modalBtn.click();
      expect(page.usernameText.getText()).toEqual("Your username: Cersei");
    });
  });

  describe('Session View for players', function() {
    it('s able to vote', function() {
      page.numbers.click();
      expect(page.userRow.getText()).toEqual('Arya 0');
      expect(page.statics.isDisplayed()).toBe(true);
      expect(page.staticsList.count()).toBe(1);
      expect(page.staticsRow.getText()).toEqual("0 1");
    });

    it('s not able to write description, clear or show votes', function() {
      page.numbers.click();
      expect(page.clearBtn.isPresent()).toBe(false);
      expect(page.showBtn.isPresent()).toBe(false);
      expect(page.descriptionInput.isEnabled()).toBe(false);
    });

    it('s not able to vote after show votes', function() {
      page.numbers.click();
      expect(page.number.isEnabled()).toBe(false);
    });
  });

  describe('Session View for moderators', function() {

    it('s not able to vote or actions related', function(){
      browser.get('/');
      browser.waitForAngular();
      page.usernameInput.sendKeys('Arya');
      page.moderatorOpt.click();
      page.startBtn.click();
      page.goBtn.click();

      expect(page.clearBtn.isPresent()).toBe(true);
      expect(page.showBtn.isPresent()).toBe(true);
      expect(page.numbersList.isPresent()).toBe(false);
      expect(page.descriptionInput.isEnabled()).toBe(true);
      expect(page.firstObserver.getText()).toBe('Arya');
    });

    it('s able to clear session', function() {
      browser.get('/');
      browser.waitForAngular();

      page.usernameInput.sendKeys('Arya');
      page.moderatorOpt.click();
      page.startBtn.click();
      page.goBtn.click();
      browser.sleep(3000);

      page.descriptionInput.sendKeys('This is an story');
      page.clearBtn.click();
      expect(page.descriptionInput.getAttribute('value')).toEqual("");
      expect(page.statics.isDisplayed()).toBe(false);
    });

    it('s able to modify description', function() {
      browser.get('/');
      browser.waitForAngular();
      page.usernameInput.sendKeys('Arya');
      page.moderatorOpt.click();
      page.startBtn.click();
      page.goBtn.click();
      browser.sleep(3000);
      page.descriptionInput.sendKeys('This is an story');

      browser.driver.executeScript('window.open();');
      var appWindow = browser.getWindowHandle();
      browser.getCurrentUrl().then(function(url){
        id = url.split('/')[5];

        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
            browser.driver.executeScript('window.focus();');
            browser.get('/');

            page.usernameInput_.sendKeys('Cersei');
            page.sessionIdInput.sendKeys(id);
            page.joinBtn.click();
            expect(page.descriptionInput.getAttribute('value')).toEqual("This is an story");
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
      });
    });
  });
});
