var koa = require('koa');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');
var appRouter = require('./routes/app.js');
var koaStatic = require('koa-static');

var path = require('path');

var app = koa();

var staticPath = path.normalize(__dirname + '/../client/build');

console.log(staticPath);

app.use(logger());
app.use(bodyParser());
app.use(koaStatic(staticPath));

app.use(appRouter.routes());

app.listen(3000);
console.log('listening on port 3000');
