var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");
var config = require('./config');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: config.pass,
    database: "wishes_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
});

app.get("/", function (req, res) {
    connection.query("SELECT * FROM wishes;", function (err, data) {
        if (err) throw err;

        res.render("index", { wishes: data });
    });
});

app.post("/", function (req, res) {

    connection.query("INSERT INTO wishes (wish) VALUES (?)", [req.body.wish], function (err, data) {
        
        if (err) throw err;

        res.redirect("/");
    });
});

app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});
