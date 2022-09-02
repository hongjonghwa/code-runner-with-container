import { ECSClient, RegisterTaskDefinitionCommand } from '@aws-sdk/client-ecs'
import {
  STSClient,
  GetSessionTokenCommand,
  GetCallerIdentityCommand,
} from '@aws-sdk/client-sts'

const config = {}

const client = new ECSClient(config)
client.config.region
;(async () => {
  try {
    // aws id
    const stsClient = new STSClient(config)
    const stsResponse = await stsClient.send(new GetCallerIdentityCommand({}))

    const AWS_ACCOUNT_ID = stsResponse.Account
    const AWS_REGION = process.env.AWS_REGION
    if (!AWS_ACCOUNT_ID || !AWS_REGION) {
      console.log('err')
      return
    }

    const command = new RegisterTaskDefinitionCommand({
      family: 'sample-fargate',
      containerDefinitions: [
        {
          name: 'fargate-app',
          // docker pull aws_account_id.dkr.ecr.us-west-2.amazonaws.com/amazonlinux:latest
          // image: 'jonghwa/code-runner-python:3.10-pandas',
          image: `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/code-runner-python:3.10-pandas`,
          // repositoryCredentials: {
          //   credentialsParameter: `arn:aws:secretsmanager::${AWS_ACCOUNT_ID}:secret:secret_name`
          // },
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: 'tcp',
            },
          ],
          essential: true,
          entryPoint: ['sh', '-c'],
          command: ['/usr/bin/python -c "print (\'hello world\')"'],
          logConfiguration: {
            logDriver: 'awslogs',
            options: {
              'awslogs-group': 'awslogs-test',
              'awslogs-region': 'ap-northeast-2',
              'awslogs-stream-prefix': 'code-runner',
              'awslogs-create-group': 'true',
            },
          },
        },
      ],
      cpu: '256',
      memory: '512',
      requiresCompatibilities: ['FARGATE'],
      networkMode: 'awsvpc',
      executionRoleArn: `arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole`,
    })

    const response = await client.send(command)
    console.log(response)
  } catch (e) {
    console.log(e)
  }
})()
