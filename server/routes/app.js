var router = require('koa-router')();
var sendfile = require('koa-sendfile');
var path = require('path');

var indexPath = path.normalize(__dirname + '/../../index.html');

// Create a new route
router.get('*', function* () {
  var stats = yield* sendfile.call(this, indexPath);
  if (!this.status) this.throw(404)
});


module.exports = router;
