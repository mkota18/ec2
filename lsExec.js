var express = require('express');
var route = express.Router();
​
console.log('testing exec')
​
​route.post('/commandEx',  (req,res) =>{
    res.send({'msg':'This is working'});
});


​
module.exports = route; 
​
​
​
// const { exec } = require("child_process");
// ​
// let command = process.argv[2];
// console.log(command);
// ​
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
   console.log(`stdout: ${stdout}`);
});