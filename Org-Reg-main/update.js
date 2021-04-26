var express = require('express');
var app = express();
const { exec } = require('child_process');

console.log("in update.js")
app.post('/clone', (req,res)=>{
    exec('update',
    (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.send({'error': error.message});
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.send({'stderr':stderr})
        }

       console.log(`stdout: ${stdout}`);
       res.send({'stdout':stdout})
    });
    
});

app.get('/tester', (req,res)=>{
    console.log("test")
    res.send({message: 'not sure!!'});
})


app.post('/run', (req,res)=>{
    exec('sh shell/run.sh',
    (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
    res.send({message: 'command executed successfully!'});
})


module.exports = app;