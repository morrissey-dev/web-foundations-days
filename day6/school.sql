--1.Enable foreign key enforcement
PRAGMA foreign_keys = ON;

--2.CREATE TABLES

CREATE TABLE students(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE enrolments(
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
     PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) 
        REFERENCES students(id),
        ON DELETE RESTRICT
    FOREIGN KEY (course_id) 
        REFERENCES courses(id)
        ON DELETE RESTRICT
);

-- 3.insert rows
INSERT INTO students (name, email) 
VALUES ('Morris Nyaga', 'morris@example.com');
INSERT INTO students (name, email) 
VALUES ('Peshy Makena', 'peshy@example.com');
INSERT INTO students (name, email)
 VALUES ('Celine Makena', 'celine@example.com');

INSERT INTO courses (name) VALUES 
('BHRM');
INSERT INTO courses (name) VALUES 
('Information Science');
INSERT INTO courses (name) VALUES 
('Software Engineering');

INSERT INTO enrolments (student_id, course_id,Grade) 
VALUES (1, 1, 'A');
INSERT INTO enrolments (student_id, course_id,Grade) 
VALUES (2, 2, 'A-');
INSERT INTO enrolments (student_id, course_id,Grade)
 VALUES (3, 3, 'B');
INSERT INTO enrolments (student_id, course_id,Grade) 
VALUES (2, 3, 'C');
INSERT INTO enrolments (student_id, course_id,Grade) 
VALUES (1, 2, 'D+');

--4.REQUIRED QUERIES

--Query 1:Find all courses taken by Morris Nyaga
SELECT students.name AS student_name,
       courses.name AS course_name
FROM students
JOIN enrolments
    ON students.id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.id
WHERE students.name='Morris Nyaga';

--Query 2:Find all students enrolled in BHRM
SELECT students.name AS student_name,
       courses.name AS course_name
FROM students
JOIN enrolments
    ON students.id = enrolments.student_id   
JOIN courses
    ON enrolments.courses_id = courses.id
WHERE courses.name = 'BHRM'

--Query 3:Count students per course
SELECT courses.name AS course_name,
       COUNT(enrolments.student_id)AS number_of_students
FROM courses
LEFT JOIN enrolments
     ON courses.id = enrolments.course_id
GROUP BY courses.id,courses.name;

--Query 4:Find students with no enrolments
SELECT students.name
FROM students
LEFT JOIN enrolments
     ON students.id = enrolments.student_id
WHERE enrolments.student_id IS NULL;

--Query 5:Update Morris's BHRM grade
UPDATE enrolments
SET grade='A+'
WHERE student_id = 1
AND course_id = 1;

--5.CREATE INDEX
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);




