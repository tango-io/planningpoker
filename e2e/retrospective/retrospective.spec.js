'use strict';
var config = require('../../server/config/environment');

describe('Retrospective View', function() {
  var page;
  var id;

  beforeEach(function() {
    page = require('./retrospective.po');
    browser.get('/');
    browser.waitForAngular();

    page.usernameInput.sendKeys('Arya');
    page.retrospectiveOpt.click();
    page.startBtn.click();
    browser.waitForAngular();

    browser.getCurrentUrl().then(function(url){
      id = url.split('/')[5];
      expect(url).toMatch('#/retrospectives/');
    });
  });

  it('s able to show data after entering a session', function() {
    expect(page.goodColumn.isPresent()).toBe(true);
    expect(page.badColumn.isPresent()).toBe(true);
    expect(page.improvementsColumn.isPresent()).toBe(true);
    expect(page.addGoodBtn.isPresent()).toBe(true);
    expect(page.addBadBtn.isPresent()).toBe(true);
    expect(page.addImpBtn.isPresent()).toBe(true);
  });

  it('s prompts username request if user does not have', function(){
    browser.getCurrentUrl().then(function(url){
      browser.driver.executeScript('window.open();');
      var appWindow = browser.getWindowHandle();
      browser.getAllWindowHandles().then(function (handles) {
        var newWindowHandle = handles[1];
        browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
          browser.driver.executeScript('window.focus();');
          browser.get(url);
          expect(page.usernameModalInput.isDisplayed()).toBe(true);
          page.usernameModalInput.sendKeys('Cersei');
          page.moderatorModalOpt.click();
          page.modalBtn.click();
          expect(page.userRow.getText()).toEqual("Arya");
          expect(page.firstModerator.getText()).toEqual("Cersei");
          browser.driver.close().then(function () {
            browser.switchTo().window(appWindow);
          });
        });
      });
    });
  });

  it('s able to copy link and id to share session', function() {
    browser.getCurrentUrl().then(function(url){
      expect(page.shareUrl.getAttribute('value')).toEqual(url);
      expect(page.shareId.getAttribute('value')).toEqual(id);
      page.shareUrlBtn.click();
      browser.sleep(2000);
      expect(page.shareTooltip.getText()).toEqual('Copied');
      page.shareIdBtn.click();
      browser.sleep(2000);
      expect(page.shareTooltip.getText()).toEqual('Copied');
      expect(page.shareTooltip.getText()).toEqual('Copied');
    });
  });

  it('s able to view moderator and players list', function(){
    expect(page.userList.count()).toBe(1);
    browser.get('/');
    browser.waitForAngular();
    page.usernameInput.sendKeys('Arya');
    page.moderatorOpt.click();
    page.retrospectiveOpt.click();
    page.startBtn.click();
    browser.sleep(1000);
    expect(page.moderatorsList.count()).toBe(1);
  });

  it('s able to add entries in all categories', function() {
    page.addGoodBtn.click();
    page.newGoodEntry.sendKeys('awesome!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.addBadBtn.click();
    page.newBadEntry.sendKeys('sad!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.addImpBtn.click();
    page.newImpEntry.sendKeys('it will be better next time!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();

    expect(page.goodList.first().getText()).toBe('awesome!');
    expect(page.badList.first().getText()).toBe('sad!');
    expect(page.impList.first().getText()).toBe('it will be better next time!');
  });

  it('s able to edit entries in all categories', function() {
    page.addGoodBtn.click();
    page.newGoodEntry.sendKeys('awesome!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.goodEdit.click();
    page.editEntry.clear();
    page.editEntry.sendKeys('super awesome!');
    page.okBtn.click();
    browser.sleep(1000);

    page.addBadBtn.click();
    page.newBadEntry.sendKeys('sad!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.badEdit.click();
    page.editEntry.clear();
    page.editEntry.sendKeys('super sad!');
    page.okBtn.click();
    browser.sleep(1000);

    page.addImpBtn.click();
    page.newImpEntry.sendKeys('it will be better next time!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.impEdit.click();
    page.editEntry.clear();
    page.editEntry.sendKeys('it will be much better next time!');
    page.okBtn.click();
    browser.sleep(1000);

    expect(page.goodList.first().getText()).toBe('super awesome!');
    expect(page.badList.first().getText()).toBe('super sad!');
    expect(page.impList.first().getText()).toBe('it will be much better next time!');
  });

  it('sn\'t able to edit an entry if it is empty',function(){
    page.addGoodBtn.click();
    page.newGoodEntry.sendKeys('awesome!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.goodEdit.click();
    page.editEntry.clear();
    page.okBtn.click();
    browser.sleep(1000);

    expect(page.modal.isPresent()).toBe(true);
  });

  it('s able to cancel edit entries', function() {
    page.addGoodBtn.click();
    page.newGoodEntry.sendKeys('awesome!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.goodEdit.click();
    page.editEntry.clear();
    page.editEntry.sendKeys('super awesome!');
    page.cancelBtn.click();
    expect(page.goodList.first().getText()).toBe('awesome!');
  });

  it('s able to remove entries in all categories', function() {
    page.addGoodBtn.click();
    page.newGoodEntry.sendKeys('awesome!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.goodRemove.click();

    page.addBadBtn.click();
    page.newBadEntry.sendKeys('sad!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.badRemove.click();

    page.addImpBtn.click();
    page.newImpEntry.sendKeys('it will be better next time!');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    page.impRemove.click();

    expect(page.goodList.count()).toBe(0);
    expect(page.badList.count()).toBe(0);
    expect(page.impList.count()).toBe(0);
  });

  describe('session view for players', function() {
    it('s not able to reveal entries', function() {
      expect(page.revealBtn.isPresent()).toBe(false);
    });
  });

  describe('Session View for moderators', function() {
    beforeEach(function(){
      browser.get('/');
      browser.waitForAngular();
      page.usernameInput.sendKeys('Arya');
      page.moderatorOpt.click();
      page.retrospectiveOpt.click();
      page.startBtn.click();
    });

    it('s able to reveal entries', function(){
      expect(page.revealBtn.isPresent()).toBe(true);
    });

    it('s able to open an entry from all categories', function() {
      page.addGoodBtn.click();
      page.addBadBtn.click();
      page.addImpBtn.click();
      page.newGoodEntry.sendKeys('awesome!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();
      page.newBadEntry.sendKeys('sad entry!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();
      page.newImpEntry.sendKeys('it will be better next time!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();

      page.revealBtn.click();

      page.goodLinkList.first().click();
      expect(page.modal.isPresent()).toBe(true);
      expect(page.showEntry.getAttribute('value')).toBe('awesome!');
      expect(page.nextBtn.isPresent()).toBe(true);
      expect(page.previousBtn.isPresent()).toBe(true);
      expect(page.readBtn.isPresent()).toBe(true);
      page.closeBtn.click();
      browser.sleep(1000);

      page.impLinkList.first().click();
      expect(page.modal.isPresent()).toBe(true);
      expect(page.showEntry.getAttribute('value')).toBe('it will be better next time!');
      expect(page.nextBtn.isPresent()).toBe(true);
      expect(page.previousBtn.isPresent()).toBe(true);
      expect(page.readBtn.isPresent()).toBe(true);
      page.closeBtn.click();
      browser.sleep(1000);

      page.badLinkList.first().click();
      expect(page.modal.isPresent()).toBe(true);
      expect(page.showEntry.getAttribute('value')).toBe('sad entry!');
      expect(page.nextBtn.isPresent()).toBe(true);
      expect(page.previousBtn.isPresent()).toBe(true);
      expect(page.readBtn.isPresent()).toBe(true);
      page.closeBtn.click();
    });

    it('s able to go to next and previous entry in reveal mode', function() {
      page.addGoodBtn.click();
      page.newGoodEntry.sendKeys('awesome!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();
      page.newGoodEntry.sendKeys('second entry!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();

      page.revealBtn.click();

      page.goodLinkList.first().click();
      expect(page.showEntry.getAttribute('value')).toBe('awesome!');
      page.nextBtn.click();
      expect(page.showEntry.getAttribute('value')).toBe('second entry!');
      page.previousBtn.click();
      expect(page.showEntry.getAttribute('value')).toBe('awesome!');
    });

    it('s able to mark or unmark entry as read', function() {
      browser.sleep(1000);
      page.addGoodBtn.click();
      page.newGoodEntry.sendKeys('awesome!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();

      page.revealBtn.click();

      page.goodLinkList.first().click();
      expect(page.showEntry.getAttribute('value')).toBe('awesome!');

      page.readBtn.click();
      page.closeBtn.click();
      browser.sleep(1000);

      expect(page.goodCheck.first().isDisplayed()).toBe(true);

      page.goodLinkList.first().click();
      page.unReadBtn.click();
      page.closeBtn.click();

      expect(page.goodCheck.first().isDisplayed()).toBe(false);
    });
  });

  describe('User event should be sincronized with all users conected', function(){

    it('should not remove entries from a user when it leaves session', function(done) {
      var appWindow, newWindowHandle;

      page.addGoodBtn.click();
      page.newGoodEntry.sendKeys('first awesome!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();
      page.addBadBtn.click();
      page.newBadEntry.sendKeys('first sad!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();
      page.addImpBtn.click();
      page.newImpEntry.sendKeys('first it will be better next time!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();

      browser.getCurrentUrl().then(function(url){
        browser.driver.executeScript('window.open();');
        appWindow = browser.getWindowHandle();
        browser.getAllWindowHandles().then(function (handles) {
          newWindowHandle = handles[1];
          browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
            browser.get(url);
            page.usernameModalInput.sendKeys('Cersei');
            page.moderatorModalOpt.click();
            page.modalBtn.click();
            browser.sleep(1000);

            page.addGoodBtn.click();

            page.newGoodEntry.sendKeys('another awesome!');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            page.addBadBtn.click();
            page.newBadEntry.sendKeys('another sad!');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            page.addImpBtn.click();
            page.newImpEntry.sendKeys('another it will be better next time!');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            browser.switchTo().window(appWindow).then(function(){
              browser.driver.executeScript('window.focus();');
              browser.sleep(2000);
              expect(page.goodList.count()).toBe(2);
              expect(page.badList.count()).toBe(2);
              expect(page.impList.count()).toBe(2);

              browser.switchTo(newWindowHandle).window(newWindowHandle).then(function(){
                browser.driver.close().then(function() {
                  browser.switchTo().window(appWindow).then(function(){
                    expect(page.goodList.count()).toBe(2);
                    expect(page.badList.count()).toBe(2);
                    expect(page.impList.count()).toBe(2);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

    it('should be able to edit entries', function(done) {
      var appWindow, newWindowHandle;

      page.addGoodBtn.click();
      page.newGoodEntry.sendKeys('first awesome!');
      browser.actions().sendKeys(protractor.Key.ENTER).perform();

      browser.getCurrentUrl().then(function(url){
        browser.driver.executeScript('window.open();');
        appWindow = browser.getWindowHandle();

        browser.getAllWindowHandles().then(function (handles) {
          newWindowHandle = handles[1];
          browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
            browser.driver.executeScript('window.focus();');
            browser.get(url);
            page.usernameModalInput.sendKeys('Cersei');
            page.moderatorModalOpt.click();
            page.modalBtn.click();
            browser.sleep(1000);
            browser.getAllWindowHandles().then(function (handles) {
              browser.driver.switchTo().window(handles[0]).then(function(){
                browser.driver.executeScript('window.focus();');
                page.goodEdit.first().click();
                page.editEntry.clear();
                page.editEntry.sendKeys('changed');
                page.okBtn.click();

                browser.driver.switchTo().window(handles[1]).then(function(){
                  browser.driver.executeScript('window.focus();');
                  expect(page.goodList.first().getText()).toBe('________ (Arya)');
                  browser.driver.close().then(function () {
                    browser.switchTo().window(appWindow);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
