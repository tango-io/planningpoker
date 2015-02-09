'use strict';

var config = require('../../server/config/local.env');

describe('Footer', function() {
  var page;

  beforeEach(function() {
    page = require('./footer.po');
    browser.get('/');
  });

  iit('s able to share via facebook', function() {
    page.fbBtn.click();

    var appWindow = browser.getWindowHandle();
    browser.getAllWindowHandles().then(function (handles) {
      var newWindowHandle = handles[1];
      browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
        browser.driver.executeScript('window.focus();');
        browser.ignoreSynchronization = true;

        //expect(page.linkedInTitle.getText()).toBe('Check this awesome planning poker app');
        //expect(page.linkedInSource.getText()).toBe(config.DOMAIN);
        //expect(page.linkedInDescription.getText()).toBe('Best app to point in your sprint planning sessions');
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

        //expect(page.linkedInTitle.getText()).toBe('Check this awesome planning poker app');
        //expect(page.linkedInSource.getText()).toBe(config.DOMAIN);
        //expect(page.linkedInDescription.getText()).toBe('Best app to point in your sprint planning sessions');
      });
    });
  });
});
