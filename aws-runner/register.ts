import { ECSClient, RegisterTaskDefinitionCommand } from '@aws-sdk/client-ecs'
import {
  STSClient,
  GetSessionTokenCommand,
  GetCallerIdentityCommand,
} from '@aws-sdk/client-sts'

const config = {}

const client = new ECSClient(config)

;(async () => {
  try {
    // aws id
    const stsClient = new STSClient(config)
    const stsResponse = await stsClient.send(new GetCallerIdentityCommand({}))
    const AWS_ID = stsResponse.Account

    const command = new RegisterTaskDefinitionCommand({
      family: 'sample-fargate',
      containerDefinitions: [
        {
          name: 'fargate-app',
          image: 'jonghwa/code-runner-python:3.10-pandas',
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
      executionRoleArn: `arn:aws:iam::${AWS_ID}:role/ecsTaskExecutionRole`,
    })

    const response = await client.send(command)
    console.log(response)
  } catch (e) {
    console.log(e)
  }
})()
