var router = require('koa-router')();
var request = require('koa-request');

// Create a new route
router.get('/', function* () {
  this.body = 'Home page';
});

module.exports = router;
