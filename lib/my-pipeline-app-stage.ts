import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { MyECSStack } from './my-pipeline-ecs-stack';

export class MyPipelineAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
      super(scope, id, props);

      const ecsStack = new MyECSStack(this, 'ECSStack');
    }
}
