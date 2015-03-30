var config = require('../../server/config/environment');

describe('voteValues View', function() {
  var page;

  beforeEach(function() {
    page = require('./voteValues.po');
    browser.get('/');
    browser.waitForAngular();
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    expect(browser.getCurrentUrl()).toMatch('#/voteValues');
  });

  it('s able to create a session', function() {
    page.goBtn.click();
    expect(browser.getCurrentUrl()).toMatch('#/sessions/');
    expect(page.modal.isPresent()).toBe(false);
  });

  it('s loads default vote values for a session', function() {
    expect(page.voteList.count()).toBe(9);
    expect(page.voteListFirstLabel.getAttribute('value')).toBe('0');
    expect(page.voteListFirstValue.getAttribute('value')).toBe('0');
  });

  it('s able to change vote values for a session', function() {
    page.voteListFirstLabel.clear();
    page.voteListFirstValue.clear();

    page.voteListFirstLabel.sendKeys('Easy');
    page.voteListFirstValue.sendKeys('0');
    page.goBtn.click();

    expect(page.voteListFirst.getText()).toBe('Easy')
    page.voteListFirst.click();
    expect(page.votesFirst.getText()).toBe('0')
  });

  it('s able to delete a vote values for a session', function() {
    expect(page.voteList.count()).toBe(9);
    page.voteListFirstBtn.click();
    expect(page.voteList.count()).toBe(8);
  });

  it('s able to add vote values for a session', function() {
    expect(page.voteList.count()).toBe(9);
    page.newVoteLabel.sendKeys('new label')
    page.newVoteValue.sendKeys(9)
    page.voteAddBtn.click();
    expect(page.voteList.count()).toBe(10);
  });
});
