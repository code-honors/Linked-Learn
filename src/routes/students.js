const express = require('express');
const server = require('../server');
const router = express.Router();
const client = require('../db');

router.get('/profile', profileHandler);
router.patch('/profile/:id', updateProfileHandler);
router.get('/courses', getAllCourses);
router.get('/courses/:id', courseHandler);
router.post('/courses', addCourses);
router.delete('/courses/:id', deleteCourses);

async function profileHandler(req, res, next) {
  try {
    const results = await client.query(
      'SELECT students.*, auth.role FROM students JOIN auth ON students.auth_id = auth.id;'
    );
    // res.json(results.rows);
    res.render('pages/studentProfile', { data: results.rows[0] });
  } catch (err) {
    next(err);
  }
}
async function updateProfileHandler(req, res, next) {
  try {
    let values = [
      req.body.firstname,
      req.body.lastname,
      req.body.profilepic,
      req.body.interest,
      req.params.id,
    ];
    const results = await client.query(
      'UPDATE students SET firstname = $1 , lastname = $2, profilepic =$3, interest =$4 WHERE id=$5 RETURNING *;',
      values
    );
    res.json(results.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function getAllCourses(req, res, next) {
  try {
    const results = await client.query(
      'SELECT students.firstname , courses.name FROM students_courses JOIN students ON students_courses.student_id = students.id JOIN courses ON students_courses.course_id = courses.id; '
    );
    res.json(results.rows);
  } catch (err) {
    next(err);
  }
}

async function courseHandler(req, res, next) {
  try {
    const results = await client.query(
      'SELECT students.firstname , courses.name FROM students_courses JOIN students ON students_courses.student_id = students.id JOIN courses ON students_courses.course_id = courses.id WHERE students_courses.course_id = $1;',
      [req.params.id]
    );
    res.json(results.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function addCourses(req, res, next) {
  try {
    let values = [1, req.body.course_id]; //from session or from req obj
    const results = await client.query(
      'INSERT INTO students_courses (student_id, course_id) values ($1, $2) RETURNING *; ',
      values
    );
    res.json(results.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteCourses(req, res, next) {
  try {
    const result = await client.query(
      'DELETE FROM students_courses WHERE  course_id=$1',
      [req.params.id]
    );
    res.send('Deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = router;
