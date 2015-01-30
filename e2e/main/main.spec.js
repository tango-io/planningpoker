'use strict';

var config = require('../../server/config/local.env');

describe('Main View', function() {
  var page;

  beforeEach(function() {
    page = require('./main.po');
    browser.get('/');
    browser.waitForAngular();
  });

  it('s able to go to vote values page', function() {
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    expect(browser.getCurrentUrl()).toMatch('#/voteValues');
  });

  it('s not able to go vote values page without a username', function() {
    page.startBtn.click();
    expect(page.usernameError.getText()).toBe('Please enter a username');
  });

  it('s able to join a session', function() {
    var id;
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    page.goBtn.click();

    browser.getCurrentUrl().then(function(url){
      id = url.split('/')[5];
      expect(id).toMatch(/^.{8}-.{4}-.{4}-.{4}-.{12}/);

      browser.driver.executeScript('window.open();');
      var appWindow = browser.getWindowHandle();
      browser.getAllWindowHandles().then(function (handles) {
        var newWindowHandle = handles[1];
        browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
          browser.driver.executeScript('window.focus();');
          browser.get('/');
          page.usernameInput_.sendKeys('Cersei');
          page.sessionIdInput.sendKeys(id);
          page.joinBtn.click();

          browser.getCurrentUrl().then(function(path){
            expect(path).toBe(config.DOMAIN +'/#/sessions/' + id);
            expect(page.modal.isPresent()).toBe(false);
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
      });
    });
  });

  it('s not able to join a session that does not exist', function() {
    page.usernameInput_.sendKeys('Sansa');
    page.sessionIdInput.sendKeys('X123');
    page.joinBtn.click();
    browser.getCurrentUrl().then(function(path){
      expect(path).toMatch('#/sessions/');
      expect(page.modal.getText()).toBe("Session does not exist")
      page.modalBtn.click();
      expect(browser.getCurrentUrl()).toBe(config.DOMAIN + "/#/");
    });
  });

  it('s not able to join a session without username and session id', function() {
    page.joinBtn.click();
    expect(page.usernameError_.getText()).toBe('Please enter a username');
    expect(page.sessionError.getText()).toBe('Please enter a session id');
  });
});
