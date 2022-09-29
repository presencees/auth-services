const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
// import * as dotenv from 'dotenv';
// dotenv.config()

require('dotenv').config()
// console.log(process.env)

const PORT = process.env.APP_PORT
// parse application/json
app.use(bodyParser.json());

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};
//create database connection
const conn = mysql.createConnection(config);
// console.log(config);

//connect to database
conn.connect((err) =>{
  // if(err) throw err;
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Mysql Connected...');
});

// login
app.post('/auth/login', (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password)
  let sql = "SELECT * FROM auth WHERE username='"+username+"' AND password='"+password+"'";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length == 1) {
      const token = createJwt(results.user_id);
      const data = {
        accessToken: token
      };
      console.log(verify(token));
      res.send(JSON.stringify({"status": 200, "error": null, "response": data}));
    } else {
      res.send(JSON.stringify({"status": 401, "error": 'Unauthorized', "response": [] }));
    }
  });
});

const sss  =  new Date().toLocaleString("en-US", {timeZone: "Asia/Makassar"})

const date = require('date-and-time')
const now  =  new Date() //.toLocaleString("en-US", {timeZone: "Asia/Makassar"})
const value = date.addMinutes(now, 60);
console.log("sss "+ sss);
console.log("time NOW " + now)
console.log("time NEXT " + value)

// functions
function verify(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
  return payload;
}

function createJwt(userId) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
        time: Date(),
        userId,
  }
  const token = jwt.sign(data, jwtSecretKey);
  return token;
}

//Server listening
app.listen(PORT,() =>{
  console.log('Server started on port '+PORT+'...');
});
