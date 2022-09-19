import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery'

import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as path from 'path'

export class MyECSStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'default-vpc-id', {
      isDefault: true,
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    const fargateTaskDefinition2 = new ecs.FargateTaskDefinition(this, 'TaskDef2', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

//    const specificContainer = fargateTaskDefinition.addContainer('DefaultContainer', {
//      image: ecs.ContainerImage.fromRegistry("nginx"),
//      memoryLimitMiB: 512,
//    });

     const specificContainer = fargateTaskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromAsset('frontendservice'),
      memoryLimitMiB: 512,
    });
    specificContainer.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP,
    });

    const specificContainer2 = fargateTaskDefinition2.addContainer('DefaultContainer2', {
      image: ecs.ContainerImage.fromAsset('backendservice'),
      memoryLimitMiB: 512,
    });
    specificContainer2.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP,
    });

    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 1,
      assignPublicIp: true
        });

    const service2 = new ecs.FargateService(this, 'Service2', {
      cluster,
      taskDefinition: fargateTaskDefinition2,
      desiredCount: 1,
      assignPublicIp: true
        });
    }
}
