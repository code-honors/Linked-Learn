DROP TABLE IF EXISTS auth CASCADE;

CREATE TYPE roles AS enum('admin', 'teacher', 'student');

CREATE TABLE IF NOT EXISTS auth(
    id SERIAL PRIMARY KEY,
    username VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    role roles DEFAULT 'student'
);
INSERT INTO auth (username, password, email, role) values ('afnan', '123456', 'afnan@gm.com', 'admin') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('ruba', '123456', 'ruba@gm.com', 'teacher') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('zaid', '123456', 'zaid@gm.com', 'student') RETURNING *;
SELECT * FROM auth;
DROP TABLE IF EXISTS students CASCADE;

CREATE TABLE IF NOT EXISTS  students(
    id SERIAL PRIMARY KEY ,
    firstname VARCHAR (255) NOT NULL,
    lastname VARCHAR (255) NOT NULL,
    profilepic VARCHAR(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png',
    interest VARCHAR(255),
    auth_id INT REFERENCES auth(id)
);

INSERT INTO students (firstname, lastname, profilepic, interest, auth_id) values ('zaid', 'alasfar','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png','code' ,3) RETURNING *;
SELECT students.firstname, auth.role FROM students JOIN auth ON students.auth_id = auth.id;

DROP TABLE IF EXISTS teachers CASCADE;

CREATE TABLE IF NOT EXISTS  teachers(
    id SERIAL PRIMARY KEY ,
    firstname VARCHAR (255) NOT NULL,
    lastname VARCHAR (255) NOT NULL,
    profilepic VARCHAR(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png',
    auth_id INT REFERENCES auth(id) 
);

INSERT INTO teachers (firstname, lastname, auth_id) values ('ruba', 'banat', 2) RETURNING *;
SELECT teachers.firstname, auth.role FROM teachers JOIN auth ON teachers.auth_id = auth.id;

DROP TABLE IF EXISTS courses CASCADE;

CREATE TABLE IF NOT EXISTS  courses(
    id SERIAL PRIMARY KEY ,
    name VARCHAR (255) NOT NULL,
    description  TEXT ,
    classes VARCHAR (255),
    category VARCHAR(255) 
);

INSERT INTO courses (name,description,classes,category) values ('Cal','asddqweqweqwe','qweqweqwe','math');
INSERT INTO courses (name,description,classes,category) values ('401','asddqweqweqwe','qweqweqwe','code');
INSERT INTO courses (name,description,classes,category) values ('301','asddqweqweqwe','qweqweqwe','code');

DROP TABLE IF EXISTS students_courses;

CREATE TABLE IF NOT EXISTS  students_courses(
    id SERIAL PRIMARY KEY ,
    student_id INT REFERENCES students(id),
    course_id INT REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO students_courses (student_id, course_id) values (1, 1) RETURNING *;
INSERT INTO students_courses (student_id, course_id) values (1, 2) RETURNING *;
SELECT * FROM students_courses JOIN students ON students_courses.student_id = students.id JOIN courses ON students_courses.course_id = courses.id;

DROP TABLE IF EXISTS teachers_courses;

CREATE TABLE IF NOT EXISTS  teachers_courses(
    id SERIAL PRIMARY KEY ,
    teacher_id INT REFERENCES teachers(id),
    course_id INT REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO teachers_courses (teacher_id, course_id) values (1, 2) RETURNING *;
INSERT INTO teachers_courses (teacher_id, course_id) values (1, 3) RETURNING *;
SELECT * FROM teachers_courses JOIN teachers ON teachers_courses.teacher_id = teachers.id JOIN courses ON teachers_courses.course_id = courses.id;
