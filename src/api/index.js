const Router = require('express').Router;
const mongodb = require('mongodb');
const version = require('../../package.json').version;
const Identity = require('fake-identity');

Date.prototype.subtractMinutes = function(minutes) {
  var copiedDate = new Date(this.getTime());
  return new Date(copiedDate.getTime() - minutes * 60000);
}

module.exports = (db) => {
  const api = Router();

  api.get('/', (req, res) => {
  	res.json({version});
  });

  api.get('/api/generate-identity', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const data = Identity.generate();
    res.json({success: true, data, error: null});
  });

  api.get('/api/generate-identity/:number', (req, res) => {
    const data = Identity.generate(+req.params.number);
    res.json({success: true, data, error: null});
  });

  api.post('/api/database/:collection', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).insertOne(req.body, (error, result) => {
      if (error) res.json({success: false, data: null, error});
      db.collection(collection).findOne({_id: result.insertedId}, (err, data) => {
        if (error) res.json({success: false, data: null, error});
        res.json({success: true, data, error: null});
      });
    });
  });

  api.get('/api/database/:collection', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).find({}).toArray((error, data) => {
      if (error) res.json({success: false, data: null, error});
      res.json({success: true, data, error: null});
    })
  });

  api.get('/api/database/:collection/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).findOne({_id: new mongodb.ObjectID(req.params.id)}, (error, data) => {
      if (error) res.json({success: false, data: null, error});
      res.json({success: true, data, error: null});
    });
  });

  api.put('/api/database/:collection/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).update({_id: new mongodb.ObjectID(req.params.id)}, req.body, {upsert: true}, (error, result) => {
      if (error) res.json({success: false, data: null, error});
      db.collection(collection).findOne({_id: new mongodb.ObjectID(req.params.id)}, (error, data) => {
        if (error) res.json({success: false, data: null, error});
        res.json({success: true, data, error: null});
      });
    });
  });

  api.delete('/api/database/:collection/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).remove({_id: new mongodb.ObjectID(req.params.id)}, (error, result) => {
      if (error) res.json({success: false, data: null, error});
      res.json({success: true, data: null, error: null});
    });
  });

  return api;
}