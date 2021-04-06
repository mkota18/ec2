// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var fs = require('fs');
const path = require('path');
AWS.config.loadFromPath('config\\rootkey.json');

function createKeyPair(userKeyName) {
    return new Promise((resolve, reject) => {
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
        var params = {
            KeyName: userKeyName
        };
        var timestamp = Date.now();
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds()

        var seedatetime = '_' + month + '_' + day + '_' + year + '_' + hour + '_' + minutes + '_' + seconds;

        var fileName = userKeyName + seedatetime;

        ec2.createKeyPair(params, function (err, data) {
            if (err) {
                reject({ "Error": err });
            } else {
                resolve({ "key_pair": JSON.stringify(data) });
                fs.writeFile('./config/' + fileName + '.pem', data.KeyMaterial, function (err) {
                    if (err) throw err;
                })

            }
        });
    });
}

function createInstance(instanceParams) {
    let instancePromise = new AWS.EC2({ apiVersion: '2016-11-15' }).runInstances(instanceParams).promise();
    return instancePromise;
}

function createTags(tagParams) {
    let tagPromise = new AWS.EC2({ apiVersion: '2016-11-15' }).createTags(tagParams).promise();
    return tagPromise;
}

function describeVpcs() {
    return new Promise((resolve, reject) => {
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

        ec2.describeVpcs(function (err, data) {
            if (err) {
                reject({ "Cannot Retrieve a VPC": err });
            } else {
                resolve({ "data": data });
            }
        })

    })
}
function createSecurityGroup(paramsSecurityGroup) {
    return new Promise((resolve, reject) => {
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
        ec2.createSecurityGroup(paramsSecurityGroup, function (err, data) {
            if (err) {
                reject({ "Error": err });
            } else {
                resolve({ "Data": data });
            }
        })
    })
}

function authorize(paramsIngress) {
    return new Promise((resolve, reject) => {
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

        ec2.authorizeSecurityGroupIngress(paramsIngress, function (err, data) {
            if (err) {
                reject({ "Error": err });
            } else {
                resolve({ "Data": data })
            }
        })
    })
}

function allocateElasticAddress(paramsAllocateAddress) {
    return new Promise((resolve, reject) => {
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
        ec2.allocateAddress(paramsAllocateAddress, function (err, data) {
            if (err) {
                reject({"Error": err});
            } else {
                resolve({"Data": data});
                };
        })
    })
}

function associateElasticAddress(paramsAssociateAddress){
    return new Promise((resolve, reject)=>{
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
        ec2.associateAddress(paramsAssociateAddress, function(err,data){
            if(err){
                reject({"Error": err});
            } else{
                resolve({"Data":data})
            };
        })
    })
}

function describeElasticIP(params){
    return new Promise((resolve, reject)=>{
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
        ec2.describeAddresses(params, function(err,data){
            if(err){
                reject({"Error":err});
            }else{
                resolve({"Data":data})
            }
        })
    })
}

function waiter(instanceId){
    let params = {
        InstanceIds: [instanceId],
        //Waiter configuration
        $waiter: {
            maxAttempts : 1000,
            delay: 10 }
        }
    
    return new Promise((resolve, reject)=>{
        var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
        ec2.waitFor("instanceRunning", params, function(err,data){
            if(err){
                console.log("error: "+ err)
                reject({"Error":err});
            }else{
                resolve({"Data":data})
            }
        })
    })
}

function createS3(s3Bucket) {
    return new Promise((resolve, reject) => {
        //create S3 Service Object
        var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
        var timestamp = Date.now();
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        s3White= s3Bucket.replace(/\s+/g, '');
        //manipulating the s3Bucket;
        var manipulatedName = s3White.toLowerCase();

        console.log(manipulatedName);

        var seedatetime = '-' + month + '-' + day + '-' + year + '-' + hour + '-' + minutes + '-' + seconds;
        //Create the parameters for calling create Bucket
        var bucketParams = {
            Bucket: manipulatedName + seedatetime
        };
        console.log(bucketParams);
        s3.createBucket(bucketParams, function (err, data) {
            if (err) {
                reject({ "Error in Promise": err });
            } else {
                resolve({ "s3": data })
            }
        })

    })
}

function createRDS(rdsParams) {
    return new Promise((resolve, reject) => {
        var rds = new AWS.RDS({ apiVersion: '2014-10-31' });
        rdsParams.DBInstanceIdentifier.replace(/\s+/g, '');
        rds.createDBInstance(rdsParams, function (err, data) {
            if (err) {
                reject({ "Error": err });
            } else {
                resolve({ "Data": data })
            }
        })

    })
}






module.exports = {
    createKeyPair: createKeyPair,
    createInstance: createInstance,
    createTags: createTags,
    describeVpcs: describeVpcs,
    createSecurityGroup: createSecurityGroup,
    authorize: authorize,
    createS3: createS3,
    createRDS: createRDS,
    allocateElasticAddress: allocateElasticAddress,
    associateElasticAddress:associateElasticAddress,
    describeElasticIP: describeElasticIP,
    waiter:waiter
}