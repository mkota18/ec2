//Importing Filesystem Module
const fs = require('fs');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
AWS.config.loadFromPath('../config/rootkey.json');
// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
//-----------------------------DELETING THE KEYPAIR------------------------
var params = {
   KeyName: process.argv[2]
};

// Delete the key pair
ec2.deleteKeyPair(params, function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log("Key Pair Deleted");
   }
});

 //----------------------------PROMISE FUNCTION FOR DELETING EC2, ELASTIC ADDRESS, SECURITY GROUPS------------------------
 //Parameter for Deleting ec2
 var paramsInstance = {
   InstanceIds: [process.argv[3]],
   DryRun: true
 };
//Parameter for Deleting Security Group 
 var params = {
  GroupId: process.argv[4]
};
//Paramater for Deleting Elastic Address
var paramsReleaseAddress = {
  AllocationId: process.argv[5]
};

function releasingInstance(params){
  return new Promise((resolve,reject)=>{
    params.DryRun= false
    ec2.stopInstances(params, function(err,data){
      if(err){
        reject({"Error in Deleting Instance": err});
      }else{
        resolve({"Data": data})
      }
    })
  })
}

function releasingSecurityGroup(params){
  return new Promise((resolve,reject)=>{
    ec2.deleteSecurityGroup(params, function(err,data){
      if(err){
        reject({"Error in Deleting Security Group": err});
      }else{
        resolve({"Data": data})
      }
    })
  })
}

function releasingElasticAddress(params){
  return new Promise((resolve,reject)=>{
    ec2.releaseAddress(params, function(err,data){
      if(err){
        reject({"Error in Releasing Elastic Address": err});
      }else{
        resolve({"Data": data})
      }
    })
  })
}

releasingInstance(paramsInstance).then(() =>{
  console.log("Success in stopping Instances");
  return releasingElasticAddress(paramsReleaseAddress);
}).then(()=>{
  console.log("Success in Releasing Elastic Address");
  return releasingSecurityGroup(params);
}).then(()=>{
  console.log("Security Group has been Released");
}).catch(err=>{
  console.log(err);
});

 //------------------------------RELEASING S3 INSTANCE------------------------------
 var bucketParams = {
   Bucket : process.argv[6]
 };
 var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

 // Call S3 to delete the bucket
 s3.deleteBucket(bucketParams, function(err, data) {
   if (err) {
     console.log("Error", err);
   } else {
     console.log("Success in Releasing S3");
   }
 });

 //--------------------------------RELEASING RDS INSTANCES-----------------------------
 var paramsDB = {
   DBInstanceIdentifier: process.argv[7], /* required */
   DeleteAutomatedBackups: true,
   SkipFinalSnapshot: true
 };
 var rds = new AWS.RDS({ apiVersion: '2014-10-31' });

 rds.deleteDBInstance(paramsDB, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log("Success in Releasing RDS");           // successful response
 });

