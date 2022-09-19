#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkecspipeStack } from '../lib/cdkecspipe-stack';

const app = new cdk.App();
new CdkecspipeStack(app, 'MyECSPipelineStack', {
  env: {
    account: '997785413584',
    region: 'us-east-1',
  }
});
app.synth();
