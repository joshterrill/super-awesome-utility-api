const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongodb = require('mongodb');
const cron = require('node-cron');
const MongoClient = mongodb.MongoClient;
const api = require('./api');
const log = require('./util/log');
const clean = require('./util/clean');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

MongoClient.connect(process.env.MLAB_URL, (err, client) => {
  if (err) {
    console.log(err);
    return;
  }
  app.listen(port, () => {
    console.log(`Server started listening on http://localhost:${port}`);
    const db = client.db(process.env.MLAB_DB);
    app.use((req, res, next) => {
      log.createLog(db, req, () => {
        next();
      });
    });
    app.use(api(db));
    // run cron every 2 minutes
    cron.schedule('*/2 * * * *', () => {
      clean.cleanDb(db);
    });
  });
});
