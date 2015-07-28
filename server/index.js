const koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const cors = require('koa-cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

/**
 * Setting config vars
 */
const staticPath = path.normalize(path.join(__dirname, '/../client/build'));
const assetsPath = path.normalize(path.join(__dirname, '/../client/images'));
const modelsPath = path.normalize(path.join(__dirname, '/models'));
const appPort = 3000;
const apiPort = 3001;

/**
 * Connect to database
 */
const mongoURI = 'mongodb://localhost/insta-print';

mongoose.connect(mongoURI);
mongoose.connection.on('error', function(err) {
  console.log(err);
});

/**
 * Load the models
 */
fs.readdirSync(modelsPath).forEach(function(file) {
  if (~file.indexOf('js')) {
    require(modelsPath + '/' + file);
  }
});


const app = koa();
// require after models initialization to prevent errors
const appRouter = require('./routes/app.js');
const proxyRouter = require('./routes/proxy.js');

app.use(cors({ origin: '*' }));
app.use(logger());
app.use(bodyParser());
app.use(koaStatic(staticPath));
app.use(koaStatic(assetsPath));

app.use(proxyRouter.routes());
app.use(appRouter.routes());

// Start app
if (!module.parent) {
  app.listen(appPort);
  app.listen(apiPort);
  console.log('Server started, listening on ports: ' + appPort + ', ' + apiPort);
}
