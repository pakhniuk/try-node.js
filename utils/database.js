// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node_complete',
//   password: '12345678'
// });

// module.exports = pool.promise();

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node_complete', 'root', '12345678', {
//   dialect: 'mysql',
//   host: 'localhost',
// });

// module.exports = sequelize;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://Test:MJlYxnufZUMhevpo@cluster0-le3r3.mongodb.net/test?retryWrites=true&w=majority',
    {
      useUnifiedTopology: true,
    }
  )
    .then(client => {
      _db = client.db();
      callback(client);
    })
    .catch(err => console.log(err));
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
