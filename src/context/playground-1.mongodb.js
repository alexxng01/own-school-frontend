/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.




// Use the rpm_school database
use('rpm_school');

// Insert activities
db.getCollection('activities').insertMany([
  {"id":1754406448063,"action":"Added new class","type":"success","timestamp":"8/5/2025, 8:52:28 PM"},
  {"id":1754385674569,"action":"Added new class schedule","type":"success","timestamp":"8/5/2025, 3:06:14 PM"},
  {"id":1754385533846,"action":"Added new class","type":"success","timestamp":"8/5/2025, 3:03:53 PM"},
  {"id":1754340347651,"action":"Added new class","type":"success","timestamp":"8/5/2025, 2:30:47 AM"}
]);

// Insert admins
db.getCollection('admins').insertMany([
  {"name":"Rahul Kumar Mahato","email":"admin@school.com","phone":"+977123456789","address":"School Administration Office","role":"School Administrator","department":"Administration","username":"Alex","password":"123456","id":"ADM-2024-001"},
  {"id":1753232250712,"name":"Rahul Mahato","email":"rm91275@gmail.com","phone":"+977123456789","address":"School Administration Office","role":"admin","department":"Administration","username":"Alex","password":"123456","idNumber":1753232250712,"profileImage":"data:image/jpeg;base64,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"}
]);

// Insert users
db.getCollection('users').insertMany([
  {"id":"admin_1","username":"Alex","password":"12345678","role":"admin","name":"Admin User"},
  {"id":"user_1","username":"user","password":"user123","role":"user","name":"Regular User"}
]);


// Insert attendance records
db.getCollection('attendanceRecords').insertMany([
  {"studentId":"STU-2025-001","class":"A10","status":"present","date":"2025-07-23"}
]);

// Insert class schedules
db.getCollection('classSchedules').insertMany([
  {"class":"math","day":"Monday","startTime":"15:06","endTime":"15:07","teacher":"Anil","room":"saipal"}
]);

// Insert students from file_students.txt
db.getCollection('students').insertMany([
  { "id": 1753238374984, "name": "rahul", "email": "r@gmail.com", "phone": "74569894", "class": "A10", "rollNumber": "2", "parentName": "Ram", "parentPhone": "67438247", "parentEmail": "r@gmail.com", "address": "djfkn", "studentId": "STU-2025-001", "username": "rahul001", "password": "rahul001", "createdAt": "2025-07-23T02:39:34.984Z", "status": "active", "parentPhoneCountry": "+977", "updatedAt": "2025-08-04T20:01:47.823Z" },
  { "id": 1753301189334, "name": "mukesh", "email": "m@gmail.com", "phone": "7768767898", "class": "A10", "rollNumber": "2", "parentName": "Nitesh", "parentPhone": "65867879", "parentEmail": "n@gmail.com", "address": "fgsd", "studentId": "STU-2025-002", "username": "mukesh002", "password": "mukesh002", "status": "active", "createdAt": "2025-07-23T20:06:29.334Z" },
  { "id": 1753301607115, "name": "saru", "email": "s@gmail.com", "phone": "564768675", "class": "A12", "rollNumber": "2", "parentName": "renn", "parentPhone": "64535467", "parentEmail": "fchgf@gmail.com", "address": "gf", "studentId": "STU-2025-003", "username": "saru003", "password": "saru003", "status": "active", "createdAt": "2025-07-23T20:13:27.115Z" },
  { "id": 1754336293118, "name": "Rahul ", "email": "`e@gmail.com", "phone": "89548y9954", "phoneCountry": "+977", "class": "A20", "rollNumber": "3", "parentName": "dfgkj,nb", "parentPhone": "8745687", "parentPhoneCountry": "+977", "address": "dfkjbn", "studentId": "STU-2025-004", "username": "stu-2025-004", "password": "rahul004", "createdAt": "2025-08-04T19:38:13.118Z", "status": "active" }
]);

// Insert empty collections if needed
db.getCollection('classes').insertMany([]);
db.getCollection('contactSubmissions').insertMany([]);

const students = [
  { name: 'Rahul', id: 'STU-2025-001', class: 'A10', rollNumber: 1, parentName: 'Ram' }
];
if (students.length > 0) {
  db.getCollection('students').insertMany(students);
}

// Insert sample teacher
const teachers = [
  { name: 'Anil', id: 'TEA-2025-001', subject: 'Math', department: 'teacher', email: 'anil@school.com', phone: '1234567890', username: 'anil001', password: 'anil001' }
];
if (teachers.length > 0) {
  db.getCollection('teachers').insertMany(teachers);
}

// Insert sample class
const classes = [
  { name: 'A10', teacher: 'Anil', subject: 'Math', section: 'A', capacity: 30, room: '101' }
];
if (classes.length > 0) {
  db.getCollection('classes').insertMany(classes);
}

// Insert sample section
const sections = [
  { name: 'A', class: 'A10', capacity: 30, teacher: 'Anil', room: '101' }
];
if (sections.length > 0) {
  db.getCollection('sections').insertMany(sections);
}