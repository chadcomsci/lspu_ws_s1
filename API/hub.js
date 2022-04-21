// CREDS BELOW
const DB_SERVER_IP = '192.168.1.134';
const DB_USER = 'admin';
const DB_PW = 'admin';

const DB_NAME = 'LSPU';
const port = 3000;

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// queries
const GET_ALL_STUDENTS = `
    SELECT
    *
    FROM
    student
`;

const GET_ALL_STUDENTS_WITH_SECTION = `
    SELECT
    student.name AS student_name,
    section.name AS section_name
    FROM
    student
    INNER JOIN section ON student.section = section.id
`;

const GET_ALL_STUDENTS_IN_SECTION = `
    SELECT
    name
    FROM
    student
    WHERE
    section = ?
`;

const GET_CLASSLIST = `
    SELECT
    student.name AS student_name,
    section.name AS section_name
    FROM
    classlist
    INNER JOIN student ON student.id = classlist.student
    INNER JOIN section ON section.id = student.section
    INNER JOIN subject ON subject.id = classlist.subject
    WHERE
    subject.id = ?
    ORDER BY student_name ASC, section_name ASC
`;

const GET_SUBJECTS = `
    SELECT
    *
    FROM
    subject
`;

// generic run
function run_query(res, query, params){
    var con = mysql.createConnection({
      host: DB_SERVER_IP,
      user: DB_USER,
      password: DB_PW,
      database: DB_NAME
    });

    con.query(query, params, function(err, result) {
        con.end();
        if(err) return res.status(500).send('Cannot run query '+err);
        return res.json(result);
    });

    return;
}

// API endpoints 
app.get('/all_students', (req, res) => {
    run_query(res, GET_ALL_STUDENTS, null);
});

app.get('/all_students_w_section', (req, res) => {
    run_query(res, GET_ALL_STUDENTS_WITH_SECTION, null);
});

app.get('/students_in_section/:section_id', (req, res) => {
    run_query(res, GET_ALL_STUDENTS_IN_SECTION, [req.params.section_id]);
});

app.get('/classlist/:subject_id', (req, res) => {
    run_query(res, GET_CLASSLIST, [req.params.subject_id]);
});

app.get('/subjects', (req, res) => {
    run_query(res, GET_SUBJECTS, null);
});


app.listen(port, () => console.log(`Listening on port ${port}..`));