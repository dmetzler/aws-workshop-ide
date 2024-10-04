#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsWorkshopIdeStack } from '../lib/aws-workshop-ide-stack';

const app = new cdk.App();

  // Get current computer public IP
fetch('https://api.ipify.org?format=text').then( response => {
  response.text().then( clientIp => {


    let stack = new AwsWorkshopIdeStack(app, 'AwsWorkshopIdeStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },    
      clientIp: clientIp
    })

    // console.log("Please add the following in your ~/.ssh/config file ")
    // console.log("")
    // console.log("-----  ~/.ssh/config file  ---------------------")
    // console.log(`Host ${stack.instance.instancePublicDnsName}`)
    // console.log("    User ec2-user")
    // console.log("------------------------------------------------")
    // console.log("")
    // console.log("Then you can start you remote IDE")


  });
});