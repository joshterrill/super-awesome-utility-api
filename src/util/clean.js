exports.cleanDb = (db) => {
  db.collection('log').aggregate([
    {"$group":
      {
        _id: "$ip",
        lastLogDate: { $last: "$date" }
      }}
  ]).toArray((err, results) => {
    for (let result of results) {
      const lastDate = new Date(result.lastLogDate).getTime();
      const now = new Date();
      
      const thirtyMinutesAgo = now.subtractMinutes(30).getTime();
      if (thirtyMinutesAgo > lastDate) {
        // delete records
        db.listCollections().toArray((err, collections) => {
          for (let collection of collections) {
            if (collection.name.includes(result._id)) {
              db.collection(collection.name).drop();
            }
          }
          // clear out log records
          db.collection('log').remove({ip: result._id});
        });
      } else {
        // don't delete records
      }
    }
  });
}