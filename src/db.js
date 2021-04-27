require('dotenv').config();
const pg = require('pg');
let client;
// let DATABASE_URL ='postgres://aawgbkjrdarjrt:636b55b32d14443428e1d13d5c1c4edace36e45c3b57465de48291b8b8a1e980@ec2-34-240-75-196.eu-west-1.compute.amazonaws.com:5432/d2jqrl997bgmh7';

// if (!process.env.DATABASE_URL) {
  client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
// } else {
//   client = new pg.Client(process.env.DATABASE_URL);
// }

module.exports = client;
