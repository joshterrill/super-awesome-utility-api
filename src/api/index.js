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
    res.json(data);
  });

  api.get('/api/generate-identity/:number', (req, res) => {
    const data = Identity.generate(+req.params.number);
    res.json(data);
  });

  api.post('/api/database/:collection', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    const insert = await db.collection(collection).insertOne(req.body, (error, result) => {
      if (error) throw new Error(error);
      db.collection(collection).findOne({_id: result.insertedId}, (err, data) => {
        if (err) throw new Error(err);
        res.json(data);
      });
    });
  });

  api.get('/api/database/:collection', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).find({}).toArray((error, data) => {
      if (error) throw new Error(error);
      res.json(data);
    })
  });

  api.get('/api/database/:collection/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).findOne({_id: new mongodb.ObjectID(req.params.id)}, (error, data) => {
      if (error) throw new Error(error);
      res.json(data);
    });
  });

  api.put('/api/database/:collection/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).update({_id: new mongodb.ObjectID(req.params.id)}, req.body, {upsert: true}, (error, result) => {
      if (error) throw new Error(error);
      db.collection(collection).findOne({_id: new mongodb.ObjectID(req.params.id)}, (err, data) => {
        if (err) throw new Error(err);
        res.json(data);
      });
    });
  });

  api.delete('/api/database/:collection/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const collection = `${ip}-${req.params.collection}`;
    db.collection(collection).remove({_id: new mongodb.ObjectID(req.params.id)}, (error, result) => {
      if (error) throw new Error(error);
      res.json(data);
    });
  });

  return api;
}