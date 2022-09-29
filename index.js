const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const now = Date.now();
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

// router
app.post('/auth/login', (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password)
  let sql = "SELECT * FROM auth WHERE username='"+username+"' AND password='"+password+"'";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length == 1) {
      // console.log(results[0]);
      const token = createJwt(results[0].user_id);
      const data = {
        accessToken: token
      };
      console.log(verify(token));
      res.setHeader('content-type', 'application/json');
      res.send(JSON.stringify({"status": 200, "error": null, "response": data}));
    } else {
      res.setHeader('content-type', 'application/json');
      res.send(JSON.stringify({"status": 401, "error": 'Unauthorized', "response": [] }));
    }
  });
});

app.post('/auth/verify', (req, res) => {
  const token = req.body.token;
  const tokenVerify = verify(token)
  console.log(tokenVerify.status);
  if (tokenVerify.status) {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify({"status": 200, "error": null, "response": tokenVerify.data}));
  } else {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify({"status": 403, "error": "ExpiredToken", "response": tokenVerify.data}));
  }

})

// functions
function verify(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
  if ((payload.exp - now) >0 ) {
    return {
      status:true,
      msg: "Tuken sudah sesuai",
      data: payload,
    };
  } else {
    return {
      status:false,
      msg: "token sudah tidak berlaku.",
      data:[]
    }
  }
}

function createJwt(userId) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    iat: now,
    exp:now+(1000*60*60*24), // satu hari (24 jam)
    // exp:now, // satu hari (24 jam)
    userId,
  }
  const token = jwt.sign(data, jwtSecretKey);
  return token;
}

//Server listening
app.listen(PORT,() =>{
  console.log('Server started on port '+PORT+'...');
});
