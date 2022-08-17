import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as efs from 'aws-cdk-lib/aws-efs';
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as cr from 'aws-cdk-lib/custom-resources';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CodeRunnerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CodeRunnerQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Create a security group that allows HTTP traffic on port 80 for our containers without modifying the security group on the instance
    const securityGroup = new ec2.SecurityGroup(this, 'nginx--7623', {
      vpc,
      allowAllOutbound: false,
    });
    
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));



    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster, // Required
      cpu: 512, // Default is 256
      desiredCount: 6, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: 2048, // Default is 512
      publicLoadBalancer: true // Default is false
    });








    
    const fileSystem = new efs.FileSystem(this, 'MyEfsFileSystem', {
      vpc: vpc,
      encrypted: true,
      lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
      throughputMode: efs.ThroughputMode.BURSTING
    });


     const params = {
      FileSystemId: fileSystem.fileSystemId,
      PosixUser: {
        Gid: 1000,
        Uid: 1000
      },
      RootDirectory: {
        CreationInfo: {
          OwnerGid: 1000,
          OwnerUid: 1000,
          Permissions: '755'
        },
        Path: '/uploads'
      },
      Tags: [
        {
          Key: 'Name',
          Value: 'ecsuploads'
        }
      ]
    };

    const efsAccessPoint = new cr.AwsCustomResource(this, 'EfsAccessPoint', {
       onUpdate: {
           service: 'EFS',
           action: 'createAccessPoint',
           parameters: params,
           physicalResourceId: cr.PhysicalResourceId.of('12121212121'),
       },
       policy: cr.AwsCustomResourcePolicy.fromSdkCalls({resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE})
    });
  }
}
