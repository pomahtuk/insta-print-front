var koa = require('koa');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');
var appRouter = require('./routes/app.js');

var app = koa();

app.use(logger());
app.use(bodyParser());

app.use(appRouter.routes());

app.listen(3000);
