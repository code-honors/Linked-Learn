require('dotenv').config();
const pg = require('pg');
let client;
let DATABASE_URL = 'postgres://zzidlgabrshhyw:265221cf22e1d75e1a3d6bd74aa6a0fc0a2365bf1b716dbfbacffbd357a58b11@ec2-54-90-211-192.compute-1.amazonaws.com:5432/d1db7j146ci2js' || process.env.DATABASE_URL;

if (!process.env.DATABASE_URL) {
  client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  client = new pg.Client(process.env.DATABASE_URL);
}

module.exports = client;
