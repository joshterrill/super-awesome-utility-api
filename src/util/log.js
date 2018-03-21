exports.createLog = (db, req, callback) => {
  const date = new Date();
  const ip = req.headers['x-forwarded-for'] || req.ip;
  const payload = {
    method: req.method,
    url: req.url,
    body: req.body,
  };
  db.collection('log').insertOne({ip, date, payload}, (err, result) => {
    if (err) callback(err);
    callback(result);
  });
}