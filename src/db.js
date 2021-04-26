require('dotenv').config();
const pg = require('pg');
let client;
let DATABASE_URL =
  'postgres://kswivudrcwfihg:afdbd3dc96ec0f5ae6e3a34b2b24e21da3e9f5411af170c41013d9cb4cc83fa6@ec2-52-7-115-250.compute-1.amazonaws.com:5432/d268u2e8q7g121';

if (!process.env.DATABASE_URL) {
  client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  client = new pg.Client(process.env.DATABASE_URL);
}

module.exports = client;
