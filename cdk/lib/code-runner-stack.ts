import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { CloudWatchLogGroup } from "aws-cdk-lib/aws-events-targets";
import * as logs from "aws-cdk-lib/aws-logs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";

export class CodeRunnerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /*
    // SQS SAMPLE
    const queue = new sqs.Queue(this, 'CodeRunnerQueue', {
      visibilityTimeout: Duration.seconds(300)
    });
    const topic = new sns.Topic(this, 'CodeRunnerTopic');
    topic.addSubscription(new subs.SqsSubscription(queue));
    */

    const vpc = new ec2.Vpc(this, "VPC", {
      // maxAzs: 2,
      cidr: "10.1.0.0/16",
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 20,
          name: "asterisk",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    new CfnOutput(this, "Subnets", {
      value: vpc.publicSubnets.map((i) => i.subnetId).join(","),
      exportName: "Subnets",
    });

    /*
    // Allow SSH (TCP Port 22) access from anywhere
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Allow SSH (TCP port 22) in',
      allowAllOutbound: true
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access')
    */
    const noInternetSG = new ec2.SecurityGroup(
      this,
      "NoInternetSecurityGroup",
      {
        vpc,
        securityGroupName: "no-internet",
        description: "no internet",
        allowAllOutbound: false,
      }
    );
    new CfnOutput(this, "NoInternetSG", {
      value: noInternetSG.securityGroupId,
      exportName: "NoInternetSG",
    });

    const internetSG = new ec2.SecurityGroup(this, "InternetSecurityGroup", {
      vpc,
      securityGroupName: "internet(80/443)",
      description: "internet access with http/https",
      allowAllOutbound: false,
    });
    internetSG.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
    internetSG.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
    new CfnOutput(this, "InternetSG", {
      value: internetSG.securityGroupId,
      exportName: "InternetSG",
    });

    const cluster = new ecs.Cluster(this, "CodeRunnerCluster", {
      clusterName: "CodeRunnerCluster",
      vpc: vpc,
    });

    const logGroup = new logs.LogGroup(this, "CodeRunnerLogGroup", {
      logGroupName: "/CodeRunner/userTaskLog",
      retention: RetentionDays.TWO_WEEKS,
    });

    /*
    // 👇 Create ACM Permission Policy
    const describeAcmCertificates = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ["arn:aws:acm:*:*:certificate/*"],
          actions: ["acm:DescribeCertificate"],
        }),
      ],
    });
    */

    // 👇 Create Role
    /*
정책 ARN
arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 
설명
Provides access to other AWS service resources that are required to run Amazon ECS tasks
aws iam attach-role-policy \
      --role-name ecsTaskExecutionRole \
      --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
    */
    // 참고 - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html
    const role = new iam.Role(this, "ecsTaskExecutionRole", {
      roleName: "ecsTaskExecutionRole",
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        ),
      ],
    });

    /*
    
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
      */
  }
}
