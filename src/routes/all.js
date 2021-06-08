const express = require('express');
const router = express.Router();
const client = require('../db');

router.get('/teachers', getAllTeachers);
router.get('/students', getAllStudents);

async function getAllTeachers(req, res, next) {
  try {
    let results = await client.query(`SELECT * FROM teachers;`);
    res.send(results.rows);
  } catch (error) {
    next(error);
  }
}
async function getAllStudents(req, res, next) {
  try {
    let results = await client.query(`SELECT * FROM students;`);
    res.send(results.rows);
  } catch (error) {
    next(error);
  }
}


module.exports = router;
