const express = require('express');
const router = express.Router();
const client = require('../db');
const moment = require('moment');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/:id/comment', addComment);
router.delete('/:id/comment', deleteComment);

async function getAllCourses(req, res, next) {
  try {
    let results = await client.query(`SELECT * FROM courses ORDER BY name;`);
    res.send(results.rows);
    // res.render('pages/home', { data: results.rows });
  } catch (error) {
    next(error);
  }
}

async function getCourseById(req, res, next) {
  try {
    let comments = await client.query(
      `SELECT * FROM course_comments WHERE course_id=$1;`,
      [req.params.id]
    );
    console.log(comments.rows);
    if (comments.rows.length > 0) {
      let results = await client.query(
        `SELECT courses.*, course_comments.* FROM courses JOIN course_comments ON courses.id = course_comments.course_id WHERE courses.id=$1;`,
        [req.params.id]
        );
        console.log(results.rows);
      res.send(results.rows);
    } else {
      let results = await client.query(`SELECT * FROM courses WHERE id=$1;`, [req.params.id]);
      console.log(results.rows);
      res.send(results.rows[0]);
    }

  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    let date = moment().utcOffset(180).format('LLL');
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

async function deleteComment(req, res, next) {
  try {
    // check student_id first
    let results = await client.query(
      `DELETE FROM course_comments WHERE course_id=$1;`,
      [req.params.id]
    );
    res.send('Deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = router;
