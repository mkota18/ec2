const http=require('http'); 
var mysql = require('mysql'); 
const express=require('express'); 
const app = express(); 
const debug = require("debug")("node-angular"); 
const bodyparser=require('body-parser'); 
// var database = require('./config/database'); 			// load the database config
var ec2Controller = require('./routers/ec2Routers');

var cors=require('cors');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cors());
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: false }));

app.use('/',ec2Controller);


app.listen(3000,()=>console.log("Server process is running on Port 3000"));