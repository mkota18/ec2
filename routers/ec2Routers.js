const express = require('express');
const route = new express.Router();
const fs = require('fs');
const ec2Controller = require('../ec2_createinstances')
const { exec } = require("child_process");

//Reading the required files 
const inboundRules = fs.readFileSync('config\\inboundRules.json', 'utf-8');
const parsedRules = JSON.parse(inboundRules);
const userData = fs.readFileSync('config\\userdata', 'utf-8');

//Converting userData to base64
let buff = new Buffer.from(userData);
let base64data = buff.toString('base64');

//Post API for AWS Automation 
route.post('/awsAutomation', (req, res) => {
    let nameReal = req.body.name
    let name= nameReal.replace(/\s+/g, '');
    let instanceId;
    let SecurityGroupId;
    ec2Controller.createKeyPair(name).then(() => {
        return ec2Controller.describeVpcs();
    }).then(vpcRes => {
        var vpc = null;
        vpc = vpcRes.data.Vpcs[0].VpcId;
        var paramsSecurityGroup = {
            Description: 'This Security Group Belongs to ' + name,
            GroupName: name,
            VpcId: vpc
        };
        return ec2Controller.createSecurityGroup(paramsSecurityGroup);
    }).then(securityGroup => {
        SecurityGroupId = securityGroup.Data.GroupId;
        var paramsIngress = {
            GroupId: SecurityGroupId,
            IpPermissions: parsedRules
        }
        return ec2Controller.authorize(paramsIngress);
    }).then(auth => {
        console.log("Ingress Successfully Set", auth.Data);
        instanceParams = {
            ImageId: "ami-035d5a5a4d0106e2e",
            InstanceType: "t2.micro",
            KeyName: name,
            MinCount: 1,
            MaxCount: 1,
            UserData: base64data,
            SecurityGroupIds: [
                SecurityGroupId
            ],
        }
        return ec2Controller.createInstance(instanceParams)
    }).then(createRes => {
        instanceId = createRes.Instances[0].InstanceId;
            console.log(name);
        let tagParams = {
            Resources: [instanceId], Tags: [
                {
                    Key: 'Name',
                    Value: name
                }
            ]
        };
        return ec2Controller.createTags(tagParams);
    }).then(tagRes => {
        res.send({ "instanceId": instanceId, "tagRes": tagRes, "status": "true" })
        return ec2Controller.waiter(instanceId);
    }).then(waiterRes => {
        console.log(JSON.stringify(waiterRes["Data"]["Reservations"][0]["Instances"][0]["State"]))
        var paramsAllocateAddress = {
            Domain: 'vpc'
        };
        return ec2Controller.allocateElasticAddress(paramsAllocateAddress);
    }).then((elasticID) => {
        var paramsAssociateAddress = {
            AllocationId: elasticID.Data.AllocationId,
            InstanceId: instanceId //Instance ID goes here
        };
        return ec2Controller.associateElasticAddress(paramsAssociateAddress);
    }).then(() => {
        var params = {
            Filters: [
                { Name: 'domain', Values: ['vpc'] }
            ]
        };
        return ec2Controller.describeElasticIP(params);
    }).then(elasticIPAddress => {
        console.log("Success", JSON.stringify(elasticIPAddress.Data.Addresses[0].PublicIp));
        return ec2Controller.createS3(name);
    }).then(() => {
        var params = {
            DBInstanceClass: 'db.t2.micro', /* required */
            DBInstanceIdentifier: name, /* required */
            Engine: 'mariadb', /* required */
            AllocatedStorage: 1000,
            MaxAllocatedStorage: 16384,
            Port: 3306,
            MasterUserPassword: 'adminrds12345',
            MasterUsername: 'adminrds',
        };
        return ec2Controller.createRDS(params);
    }).then(createRDSInstance => {
        console.log("Success RDS Instance Creation " + JSON.stringify(createRDSInstance.Data.DBInstance.DBInstanceIdentifier));
    }).catch(err => {
        console.log(err)
        res.send({ "Err": err })
    })
});

route.post('/commandsExec',(req,res)=>{
    console.log(req.body.commands)
    let command_s = req.body.commands
    exec(command_s, (error, stdout, stderr) => {
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
module.exports = route



