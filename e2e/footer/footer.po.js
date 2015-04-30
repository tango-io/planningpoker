'use strict';

var Footer = function() {
  this.footer = element(by.css('footer'));

  this.twitterBtn = this.footer.element(by.css('.twitter'));
  this.fbBtn = this.footer.element(by.css('.facebook'));
  this.linkedInBtn = this.footer.element(by.css('.linkedin'));

  this.twitterText = element(by.css('.action-information'));
  this.twitterShareText = element(by.css('textarea#status'));

  this.linkedInTitle = element(by.css('h3.title'));
  this.linkedInSource = element(by.css('cite.source'));
  this.linkedInDescription = element(by.css('p.description'));
};

module.exports = new Footer();

