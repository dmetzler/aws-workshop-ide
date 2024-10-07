import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as fs from 'fs';

import { Construct } from 'constructs';

interface WorkshopIdeStackProps extends cdk.StackProps {
  clientIp: string;
  userName: string;
  publicKeyPath?: string;  
  instanceClass?: ec2.InstanceClass;
  instanceSize?: ec2.InstanceSize;
  managedPolicy?: iam.IManagedPolicy;
}

export class AwsWorkshopIdeStack extends cdk.Stack {

  public instance:ec2.Instance;

  constructor(scope: Construct, id: string, props: WorkshopIdeStackProps) {
    super(scope, id, props);

    // Define default variables
    if(props.instanceClass === undefined) {
      props.instanceClass = ec2.InstanceClass.T2
    }

    if(props.instanceSize === undefined) {
      props.instanceSize = ec2.InstanceSize.MICRO
    }

    if(props.managedPolicy === undefined) {
      props.managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
    }

    if(props.publicKeyPath === undefined){
      const homedir = require('os').homedir();
      props.publicKeyPath = `${homedir}/.ssh/id_rsa.pub`  
    }

    // Get the default VPC
    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    // Create instance role with Administrator Acces
    const instanceRole = new iam.Role(this, 'workshop-instance-role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        props.managedPolicy,
      ]
    }) 
    
    const sshKeyPairContent = fs.readFileSync(props.publicKeyPath).toString()
    const sshKeyPair = new ec2.CfnKeyPair(this, 'workshop-ssh-key', {
      keyName: 'workshop-ssh-key',
      publicKeyMaterial: sshKeyPairContent
    })

    // Create Security group
    const securityGroup = new ec2.SecurityGroup(this, 'workshop-security-group', {
      vpc: defaultVpc,
      allowAllOutbound: true,
      securityGroupName: 'workshop-security-group'
    })

    // create ingress on ssh port
    securityGroup.addIngressRule(ec2.Peer.ipv4(`${props.clientIp}/32`), ec2.Port.tcp(22), 'Allow SSH Access')
    
    // Create EC2 instance
    const instance = new ec2.Instance(this, 'workshop-instance', {
      vpc: defaultVpc,
      instanceType: ec2.InstanceType.of(
        props.instanceClass, 
        props.instanceSize
      ),
      machineImage: new ec2.AmazonLinux2023ImageSsmParameter(),
      vpcSubnets: { 
        subnetType: ec2.SubnetType.PUBLIC 
      },
      role: instanceRole,
      keyPair: ec2.KeyPair.fromKeyPairAttributes(this, 'KeyPair', {
        keyPairName: sshKeyPair.keyName,
        type: ec2.KeyPairType.RSA,
      }),
      userData: ec2.UserData.custom(`#!/bin/bash
        sudo yum install -y git python
        python -m ensurepip --upgrade
        mkdir -p /home/ec2-user/environment        
        chown -R ec2-user:ec2-user /home/ec2-user/
      `),
      securityGroup: securityGroup
    })

    // Output the IP Address of the ec2 instance
    new cdk.CfnOutput(this, 'InstancePublicIpAddress', {
      value: instance.instancePublicDnsName
    })

  }
}
