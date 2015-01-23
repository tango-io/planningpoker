'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
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

  //it('s able to join a session', function() {
  //  page.usernameInput_.sendKeys('Arya');
  //  page.sessionIdInput.sendKeys('X123');
  //  page.joinBtn.click();
  //});

  it('s able to join a session that does not exist', function() {
    page.usernameInput_.sendKeys('Arya');
    page.sessionIdInput.sendKeys('X123');
    page.joinBtn.click();
  });

  //it('s not able to join a session without username and session id', function() {
  //  expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
  //  expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
  //  expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  //});
});
