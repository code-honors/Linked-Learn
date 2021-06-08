DROP TABLE IF EXISTS auth CASCADE;

DROP TYPE IF EXISTS roles;
CREATE TYPE roles AS enum('admin', 'teacher', 'student');

CREATE TABLE IF NOT EXISTS auth(
    id SERIAL PRIMARY KEY,
    username VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    role roles DEFAULT 'student' NOT NULL
);
INSERT INTO auth (username, password, email, role) values ('afnan', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'afnan@gm.com', 'admin') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('ruba', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'ruba@gm.com', 'teacher') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('zaid', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'zaid@gm.com', 'student') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('ahmad', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'ahmad@gm.com', 'teacher') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('lina', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'lina@gm.com', 'teacher') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('mohammad', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'moh@gm.com', 'teacher') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('issa', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'issa@gm.com', 'teacher') RETURNING *;
INSERT INTO auth (username, password, email, role) values ('linda', '$2b$10$bU2t0RLijsvFs6hdfCDqT.HSFXCw2i.cjvILr6.mVxvn3Q587Rz8e', 'linda@gm.com', 'teacher') RETURNING *;
SELECT * FROM auth;
DROP TABLE IF EXISTS students CASCADE;

CREATE TABLE IF NOT EXISTS  students(
    id SERIAL PRIMARY KEY ,
    firstname VARCHAR (255) NOT NULL,
    lastname VARCHAR (255) NOT NULL,
    profilepic VARCHAR(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1200px-Crystal_Clear_kdm_user_female.svg.png',
    interest VARCHAR(255),
    about TEXT,
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
    about TEXT,
    auth_id INT REFERENCES auth(id) 
);

INSERT INTO teachers (firstname, lastname, auth_id) values ('Ruba', 'Banat', 2) RETURNING *;
-- INSERT INTO teachers (firstname, lastname, profilepic, auth_id) values ('Ahmad', 'Frijat','https://avatars.githubusercontent.com/u/75928390?v=4', 4) RETURNING *;
INSERT INTO teachers (firstname, lastname, profilepic, auth_id) values ('Lina', 'Alasfar','https://images.pexels.com/photos/3772711/pexels-photo-3772711.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-3772711.jpg&fm=jpg', 5) RETURNING *;
INSERT INTO teachers (firstname, lastname, profilepic, auth_id) values ('Mohammad', 'Ahmad','https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Haddad_em_campanha_2018_%28cropped%29.jpg/800px-Haddad_em_campanha_2018_%28cropped%29.jpg', 6) RETURNING *;
INSERT INTO teachers (firstname, lastname, profilepic, auth_id) values ('Issa', 'Josef','https://pbs.twimg.com/profile_images/1017809554153836544/juyy5-2Y_400x400.jpg', 7) RETURNING *;
INSERT INTO teachers (firstname, lastname, profilepic, auth_id) values ('Linda', 'Mailss','https://academist.qodeinteractive.com/wp-content/uploads/2018/06/educator-img-3.jpg', 8) RETURNING *;
SELECT teachers.firstname, auth.role FROM teachers JOIN auth ON teachers.auth_id = auth.id;

DROP TABLE IF EXISTS courses CASCADE;

CREATE TABLE IF NOT EXISTS  courses(
    id SERIAL PRIMARY KEY ,
    name VARCHAR (255) NOT NULL,
    img VARCHAR (255) DEFAULT 'https://academist.qodeinteractive.com/wp-content/uploads/2018/07/courses-3.jpg',
    category VARCHAR(255),
    description TEXT ,
    classes TEXT
);


INSERT INTO courses (name,description,category,classes) values ('Cal','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris . Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','math', 'Class 1:');
INSERT INTO courses (name,description,category,classes) values ('401','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris . Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','code', 'Class 1:');
INSERT INTO courses (name,description,category,classes) values ('301','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris . Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','code', 'Class 1:');


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
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(id),
    course_id INT REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO teachers_courses (teacher_id, course_id) values (1, 2) RETURNING *;
INSERT INTO teachers_courses (teacher_id, course_id) values (1, 3) RETURNING *;
INSERT INTO teachers_courses (teacher_id, course_id) values (2, 1) RETURNING *;
SELECT * FROM teachers_courses JOIN teachers ON teachers_courses.teacher_id = teachers.id JOIN courses ON teachers_courses.course_id = courses.id;

DROP TABLE IF EXISTS course_comments;

CREATE TABLE IF NOT EXISTS course_comments(
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    time VARCHAR(255)
);

DROP TABLE IF EXISTS teachers_events;

CREATE TABLE IF NOT EXISTS teachers_events(
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(id),
    event VARCHAR(255),
    time VARCHAR(255)
);

DROP TABLE IF EXISTS students_events;

CREATE TABLE IF NOT EXISTS students_events(
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    event VARCHAR(255),
    time VARCHAR(255)
);
