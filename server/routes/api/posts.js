const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());
const messagesTableName = "messages";

const db = require('../../index'); // exports from db from index

//Get posts
router.get("/", (req, res) => {
    let sql = `SELECT * FROM ${messagesTableName}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// router.post("/addMessage", (req, res) => {
//     if (req) {
//         let dateTime = new Date();
//         let formattedDateTime = `${dateTime.getFullYear()}-${dateTime.getMonth() +
//             1}-${dateTime.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
//         let sql = `INSERT INTO ${messagesTableName} (id, text, date, owner) VALUES (NULL, '${req.body.text}', '${formattedDateTime}', '${req.body.owner}');`;

//         db.query(sql, (err, result) => {
//             if (err) throw err;
//             res.status(201).send();
//         });
//     }
// });

// app.get("/createdb", (req, res) => {
//   let sql = "CREATE DATABASE nodemysql";
//   db.query(sql, (err, result) => {
//       if (err) throw err;
//       res.send("database created");
//   });
// });

module.exports = router;
