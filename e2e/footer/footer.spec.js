'use strict';

var config = require('../../server/config/local.env');

describe('Footer', function() {
  var page;

  beforeEach(function() {
    page = require('./footer.po');
    browser.get('/');
  });

  it('s able to share via facebook', function() {
    page.fbBtn.click();
    var appWindow = browser.getWindowHandle();
    browser.getAllWindowHandles().then(function (handles) {
      var newWindowHandle = handles[1];
      browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
        browser.driver.executeScript('window.focus();');
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toMatch('facebook.com');
        browser.driver.close().then(function () {
          browser.switchTo().window(appWindow);
        });
      });
    });
  });

  it('s able to share via twitter', function() {
    page.twitterBtn.click();
    var appWindow = browser.getWindowHandle();
    browser.getAllWindowHandles().then(function (handles) {
      var newWindowHandle = handles[1];
      browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
        browser.driver.executeScript('window.focus();');
        browser.ignoreSynchronization = true;

        expect(page.twitterText.getText()).toBe('Share a link with your followers');
        expect(page.twitterShareText.getText()).toBe('Check this awesome planning poker app ' + config.DOMAIN + "/");

        browser.driver.close().then(function () {
          browser.switchTo().window(appWindow);
        });
      });
    });
  });

  it('s able to share via linkedin', function() {
    page.linkedInBtn.click();
    var appWindow = browser.getWindowHandle();
    browser.getAllWindowHandles().then(function (handles) {
      var newWindowHandle = handles[1];
      browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
        browser.driver.executeScript('window.focus();');
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toMatch('linkedin.com');
        browser.driver.close().then(function () {
          browser.switchTo().window(appWindow);
        });
      });
    });
  });
});
