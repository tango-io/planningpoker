'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: process.env.DOMAIN || 'http://localhost:9000',
  SESSION_SECRET: "pokerestimate-secret",
  // Control debug level for modules using visionmedia/debug
  DEBUG: '',

  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
};
