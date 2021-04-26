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
      'SELECT teachers.*, auth.role FROM teachers JOIN auth ON teachers.auth_id = auth.id;'
    );
    // res.json(results.rows);
    res.render('pages/teacherProfile', { element: results.rows[0] });
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
      req.params.id,
    ];

    const results = await client.query(
      'UPDATE teachers SET firstname = $1 , lastname = $2, profilepic =$3 WHERE id=$4 RETURNING *;',
      values
    );
    // console.log(results.rows[0]);
    res.json(results.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function getAllCourses(req, res, next) {
  try {
    const results = await client.query(
      'SELECT teachers.firstname , courses.name FROM teachers_courses JOIN teachers ON teachers_courses.teacher_id = teachers.id JOIN courses ON teachers_courses.course_id = courses.id; '
    );
    res.json(results.rows);
  } catch (err) {
    next(err);
  }
}

async function courseHandler(req, res, next) {
  try {
    const results = await client.query(
      'SELECT teachers.firstname , courses.name FROM teachers_courses JOIN teachers ON teachers_courses.teacher_id = teachers.id JOIN courses ON teachers_courses.course_id = courses.id WHERE teachers_courses.course_id = $1;',
      [req.params.id]
    );
    console.log(results.rows);
    res.json(results.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function addCourses(req, res, next) {
  try {
    let values = [
      req.body.name,
      req.body.description,
      req.body.classes,
      req.body.category,
    ]; //from session or from req obj
    // console.log('------------', values);

    const course = await client.query(
      'INSERT INTO courses (name,description,classes,category) values($1,$2,$3,$4) RETURNING id;',
      values
    );
    // console.log('------------', course.rows[0].id);

    const results = await client.query(
      'INSERT INTO teachers_courses (teacher_id, course_id) values ($1, $2) RETURNING *; ',
      [1, course.rows[0].id]
    );

    res.json(results.rows[0]);
  } catch (err) {
    // console.log(err);
    next(err);
  }
}

async function deleteCourses(req, res, next) {
  try {
    const teacherCourse = await client.query(
      'SELECT * FROM teachers_courses WHERE course_id=$1 AND teacher_id=$2;',
      [req.params.id, 1]
    ); //from session or req.obj
    if (teacherCourse.rows.length > 0) {
      const course = await client.query('DELETE FROM courses WHERE id = $1;', [
        req.params.id,
      ]);
      // console.log(course.rows);
    }
    res.send('Deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = router;
