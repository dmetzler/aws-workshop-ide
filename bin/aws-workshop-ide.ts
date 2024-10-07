#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsWorkshopIdeStack } from '../lib/aws-workshop-ide-stack';

const app = new cdk.App();

  // Get current computer public IP
fetch('https://api.ipify.org?format=text').then( response => {
  response.text()
  .then( clientIp => {
    new AwsWorkshopIdeStack(app, 'AwsWorkshopIdeStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },    
      clientIp: clientIp,
      userName: process.env.USER!
    })
  })
  .catch( err => {
    console.log(`Unable to get public IP of client:  ${err}`)
  });
});

