'use strict';

var config = require('../../server/config/local.env');

describe('Main View', function() {
  var page;

  beforeEach(function() {
    page = require('./main.po');
    browser.get('/');
    browser.waitForAngular();
  });

  it('s able to create a session', function() {
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    expect(browser.getCurrentUrl()).toMatch('#/sessions/');
  });

  it('s not able to create a session without a username', function() {
    page.startBtn.click();
    expect(page.usernameError.getText()).toBe('Please enter a username');
  });

  it('s able to join a session', function() {
    var id;
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();

    browser.getCurrentUrl().then(function(url){
      id = url.split('/')[4];
      browser.get('/');
      page.usernameInput_.sendKeys('Cersei');
      page.sessionIdInput.sendKeys(id);
      page.joinBtn.click();
      browser.getCurrentUrl().then(function(path){
        expect(path).toMatch('#/sessions/' + id);
      });
    })

  });

  it('s not able to join a session that does not exist', function() {
    page.usernameInput_.sendKeys('Sansa');
    page.sessionIdInput.sendKeys('X123');
    page.joinBtn.click();
    expect(browser.getCurrentUrl()).toMatch('#/sessions/');
    browser.sleep(2000);
    expect(page.modal.getText()).toBe("Session does not exist")
    page.modalBtn.click();
    expect(browser.getCurrentUrl()).toBe(config.DOMAIN + "/#/");
  });

  it('s not able to join a session without username and session id', function() {
    page.joinBtn.click();
    expect(page.usernameError_.getText()).toBe('Please enter a username');
    expect(page.sessionError.getText()).toBe('Please enter a session id');
  });
});
