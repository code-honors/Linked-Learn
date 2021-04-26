require('dotenv').config();
const pg = require('pg');
let DATABASE_URL = process.env.DATABASE_URL || 'postgres://kswivudrcwfihg:afdbd3dc96ec0f5ae6e3a34b2b24e21da3e9f5411af170c41013d9cb4cc83fa6@ec2-52-7-115-250.compute-1.amazonaws.com:5432/d268u2e8q7g121';
const client = new pg.Client(DATABASE_URL);
// const client = new pg.Client({
//     user     : 'adamra',
//     password : '123456',
//     database : 'linkedlearntest',
//     host     : 'localhost',
//     port     : '5432'
//   });

module.exports = client;
