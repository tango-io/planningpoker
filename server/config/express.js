/**
 * Express configuration
 */

'use strict';

var express        = require('express');
var favicon        = require('serve-favicon');
var morgan         = require('morgan');
var compression    = require('compression');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieParser   = require('cookie-parser');
var errorHandler   = require('errorhandler');
var path           = require('path');
var config         = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  app.locals.FACEBOOK_APP_ID= config.FACEBOOK_APP_ID;
  app.locals.GOOGLE_ANALYTICS_ID= config.GOOGLE_ANALYTICS_ID;
  app.locals.DOMAIN = config.DOMAIN;

  app.set('view engine', 'jade');
  app.set('views', config.root + '/client/');

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if ('production' === env || 'staging' === env) {
    app.set('views', path.join(config.root + '/public'));
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(errorHandler()); // Error handler - has to be last
  }

  if('test' !== env){
    app.use(morgan('dev'));
  }

};
