DROP TABLE IF EXISTS auth CASCADE;

CREATE TYPE roles AS enum('admin', 'teacher', 'student');

CREATE TABLE IF NOT EXISTS auth(
    id SERIAL PRIMARY KEY,
    username VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    role roles DEFAULT 'student'
);

DROP TABLE IF EXISTS students CASCADE;

CREATE TABLE IF NOT EXISTS  students(
    id SERIAL PRIMARY KEY ,
    firstname VARCHAR (255) NOT NULL,
    lastname VARCHAR (255) NOT NULL,
    auth_id INT REFERENCES auth(id)
);

DROP TABLE IF EXISTS teachers CASCADE;

CREATE TABLE IF NOT EXISTS  teachers(
    id SERIAL PRIMARY KEY ,
    firstname VARCHAR (255) NOT NULL,
    lastname VARCHAR (255) NOT NULL,
    auth_id INT REFERENCES auth(id) 
);


DROP TABLE IF EXISTS courses CASCADE;

CREATE TABLE IF NOT EXISTS  courses(
    id SERIAL PRIMARY KEY ,
    name VARCHAR (255) NOT NULL,
    description  TEXT ,
    classes VARCHAR (255),
    category VARCHAR(255) 
);

INSERT INTO courses (name,description,classes,category) values ('Cal','asddqweqweqwe','qweqweqwe','math');


DROP TABLE IF EXISTS students_courses;

CREATE TABLE IF NOT EXISTS  students_courses(
    id SERIAL PRIMARY KEY ,
    student_id INT REFERENCES students(id),
    course_id INT REFERENCES courses(id)
);

DROP TABLE IF EXISTS teachers_courses;

CREATE TABLE IF NOT EXISTS  teachers_courses(
    id SERIAL PRIMARY KEY ,
    teacher_id INT REFERENCES teachers(id),
    course_id INT REFERENCES courses(id)
);

