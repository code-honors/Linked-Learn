const express = require('express');
const router = express.Router();
const client = require('../db');
const moment = require('moment');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/:id', addComment);

async function getAllCourses(req, res, next) {
  try {
    let results = await client.query(`SELECT * FROM courses ORDER BY name;`);
    res.render('pages/home', { data: results.rows });
  } catch (error) {
    next(error);
  }
}

async function getCourseById(req, res, next) {
  try {
    let results = await client.query(`SELECT * FROM courses WHERE id=$1;`, [
      req.params.id,
    ]);
    // console.log(results.rows);
    res.send(results.rows[0]);
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    let date = moment().format('LLL');
    console.log(date);
    let results = await client.query(
      `INSERT INTO course_comments (comment, student_id, time, course_id) VALUES($1, $2, $3, $4) RETURNING *;`,
      [req.body.comment, 1, date, req.params.id] // from session or req.obj
    );
    // res.send(results.rows[0]);
    res.send(results.rows[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = router;
