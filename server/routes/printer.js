const router = require('koa-router')();

// pass everything to react
router.get('/printer', function* () {
  try {
    this.status = 200;
    this.body = 'printer';
  } catch (err) {
    this.throw(err);
  }
});

module.exports = router;
