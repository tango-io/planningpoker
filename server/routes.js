/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {
  app.use('/', function (req, res) {
    res.render('index');
  });
};
