const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

const http = require("http").Server(app);

//#region database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodemysql"
});
const messagesTableName = "messages";

async function connectToDatabase() {
    // wait until the promise returns us a value
    await new Promise((res, rej) => {
        // connect to mysql
        db.connect(err => {
            if (err) {
                throw err;
            }
            console.log("mysql connected...");
            res("done");
        });
    });
}

//#endregion

let databasePromise = connectToDatabase();

//#region sockets
const io = require("socket.io")(http);

io.on("connection", socket => {
    socket.on("message", msg => {
        //listen client
        databasePromise.then(() => {
            let dateTime = new Date();
            let formattedDateTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
            let sql = `INSERT INTO ${messagesTableName} (id, text, date, owner) VALUES (NULL, '${msg.text}', '${formattedDateTime}', '${msg.owner}');`;
    
            db.query(sql, (err, result) => {
                if (err) throw err;
                io.emit("message", msg); //send message back to client
            });
        });
    });
});

//#endregion

// Todo: https init
// var fs = require("fs");
// var https = require("https");
// var privateKey = fs.readFileSync("localhost.key", "utf8");
// var certificate = fs.readFileSync("localhost.cert", "utf8");

// middleware
app.use(bodyParser.json());
app.use(cors());

module.exports = db;

const posts = require("./routes/api/posts");

app.use("/api/posts", posts);

const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log(`server started on port ${port}`);
});


// Todo: https init
// https
//     .createServer(
//         {
//             key: privateKey,
//             cert: certificate
//         },
//         app
//     )
//     .listen(port, () => {
//         console.log(`Listening at ${port}`);
//     });
