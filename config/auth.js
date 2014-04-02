// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  'twitterAuth' : {
    'consumerKey'     : process.env.TWITTER_CONSUMER_KEY || 'unknown',
    'consumerSecret'  : process.env.TWITTER_CONSUMER_SECRET || 'unknown',
    'callbackURL'     : 'http://localhost:3000/auth/twitter/callback'
  }


};
