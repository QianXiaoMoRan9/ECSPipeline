import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { MyPipelineAppStage } from './my-pipeline-app-stage';

export class CdkecspipeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repo = codecommit.Repository.fromRepositoryArn(this, 'Repo', 'arn:aws:codecommit:us-east-1:997785413584:cdkecspipe');
    const frontendservice = codecommit.Repository.fromRepositoryArn(this, 'frontendRepo', 'arn:aws:codecommit:us-east-1:997785413584:ECS_Dockerfile');
    const backendservice = codecommit.Repository.fromRepositoryArn(this, 'backendRepo', 'arn:aws:codecommit:us-east-1:997785413584:backendService');

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyECSPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.codeCommit(repo, 'master'),
        commands: ['npm ci', 'npm run build','pwd','ls -la','npx cdk synth', 'cat cdk.out/assembly-MyECSPipelineStack-test/MyECSPipelineStacktestECSStack7AD9B5D2.template.json'],
        additionalInputs: {
          'frontendservice': CodePipelineSource.codeCommit(frontendservice, 'main'),
          'backendservice': CodePipelineSource.codeCommit(backendservice, 'master'),
        },
      })
    });

    pipeline.addStage(new MyPipelineAppStage(this, "test", {
     env: { account: "997785413584", region: "us-east-1" }
   }));
  }
}
