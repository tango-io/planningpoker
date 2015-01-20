/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));

  // All undefined asset or api routes should return a 404
  app.get('/:url(api|auth|components|app|bower_components|assets)/*')

  app.get('/*', function(req, res) {
    var stripped = req.url.split('/')[1];
    res.render(stripped, function (err, view) {
      if(err) {
        console.log("Error rendering partial '" + requestedView + "'\n", err);
        res.send(404, {error: err});
      }
      res.send(view);
    });
  });

  //app.get('/session', function(req, res) {
  //  res.render('session', function (err, view) {
  //    if(err) {
  //      console.log("Error rendering partial '" + requestedView + "'\n", err);
  //      res.send(404, {error: err});
  //    }
  //    res.send(view);
  //  });
  //});
};
