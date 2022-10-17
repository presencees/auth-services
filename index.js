const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const now = Date.now();
// import * as dotenv from 'dotenv';
// dotenv.config()

require("dotenv").config();
// console.log(process.env)

const PORT = process.env.APP_PORT;
// parse application/json
app.use(bodyParser.json());

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
//create database connection
const conn = mysql.createConnection(config);
// console.log(config);

//connect to database
conn.connect((err) => {
  // if(err) throw err;
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Mysql Connected...");
});

// router
app.get("/", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.send(
    JSON.stringify({
      status: 200,
      error: null,
      message: "auth services is available",
    })
  );
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token
  conn.query("SELECT token FROM Tokens WHERE token='" + refreshToken + "'", (err, results) => {
    if (err) throw err;

    if (results.length == 0) {
      res.sendStatus(403)
    } else {

      jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = createJwt(user)
        const data = {
          accessToken: accessToken,
        };
        res.send(JSON.stringify({status: 200, error: null, response: data}));
      })

    }
  })
})

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  let sql =
    "SELECT * FROM auth WHERE username='" +
    username +
    "' AND password='" +
    password +
    "'";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length == 1) {
      // console.log(results[0]);
      const token = createJwt(results[0].user_id);
      const refreshToken = jwt.sign(results[0].user_id, process.env.JWT_REFRESH_TOKEN_SECRET);
      const data = {
        accessToken: token,
        refreshToken: refreshToken
      };
      const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let userId = results[0].user_id
      let checkToken =
        "SELECT id FROM Tokens WHERE userId=" + results[0].user_id + "";
      conn.query(checkToken, (err, results) => {
        if (err) throw err;
        if (results.length == 1) {
          conn.query("UPDATE Tokens SET token = '" + refreshToken + "', updatedAt = '" + datetime + "' WHERE id = " + results[0].id + ";", (err, _) => {
            if (err) throw err;
            console.log("user token successfully updated!")
          })
        } else {
          let insertToken =
            "INSERT INTO Tokens VALUES (0," + userId + ",'" + refreshToken + "','" + datetime + "','" + datetime + "')";
          conn.query(insertToken, (err, _) => {
            if (err) throw err;
            console.log("user token inserted successfully!")
          })
        }
      })
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({status: 200, error: null, response: data}));
    } else {
      res.setHeader("content-type", "application/json");
      res.send(
        JSON.stringify({status: 401, error: "Unauthorized", response: []})
      );
    }
  });
});

app.post("/verify", (req, res) => {
  const token = req.body.token;
  //const tokenVerify = verify(token, process.env.JWT_SECRET_KEY);
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (!err) {
      res.setHeader("content-type", "application/json");
      res.send(
        JSON.stringify({status: 200, error: null, response: payload})
      );
    } else {
      res.setHeader("content-type", "application/json");
      res.status(401)
      res.send(
        JSON.stringify({
          status: 'error',
          error: err,
        })
      );
    }

  });
});

// functions
function createJwt(userId) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    iss: process.env.ISS,
    //exp: now + 1000
    //exp: now + 1000 * 60 * 60 * 24, // satu hari (24 jam)
    userId,
  };
  const token = jwt.sign(data, jwtSecretKey, {expiresIn: '2h'});
  return token;
}

//Server listening
app.listen(PORT, () => {
  console.log("Server started on port " + PORT + "...");
});
