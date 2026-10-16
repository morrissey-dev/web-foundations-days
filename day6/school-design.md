# School Database Design

## 1. Tables

- **students:** Stores student information, including each student's ID, name, and email. Each student has a unique ID and email.
- **courses:** Stores course information, including each course's ID and name.
- **enrolments:** Connects students to the courses they take and stores their grades. The combination of `student_id` and `course_id` forms the primary key, preventing duplicate enrolments in the same course.

## 2. Relationships

A student can have many enrolments, and a course can have many enrolments. This creates a many-to-many relationship between students and courses because a student can take several courses, and each course can have several students.

The `enrolments` table acts as a junction table connecting students and courses through their IDs. It also stores the grade for each student-course combination.

## 3. Index

An index is created on `course_id` in the `enrolments` table to help the database find enrolments for a particular course more efficiently.

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
```

## 4. SQL vs NoSQL

SQL databases store structured data in tables and use relationships, keys, and constraints to maintain data integrity. NoSQL databases can store data in more flexible formats, such as documents. SQL is suitable for this school database because students, courses, and enrolments have clear relationships that need to be maintained.