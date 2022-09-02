import {
  ECSClient,
  RunTaskCommand,
  RegisterTaskDefinitionCommand,
} from '@aws-sdk/client-ecs' // ES Modules import
const config = {}

const client = new ECSClient(config)

/*
Outputs:
CodeRunnerStack.InternetSG = sg-06ef859797025f59d
CodeRunnerStack.NoInternetSG = sg-022fe6d8f6eaee5b7
CodeRunnerStack.Subnets = subnet-0a6f77a9e242db996,subnet-09984f4c6c9526527
*/

;(async () => {
  try {
    const command = new RunTaskCommand({
      // count:1,
      launchType: 'FARGATE',
      taskDefinition: 'sample-fargate',
      cluster: 'CodeRunnerCluster',
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: 'ENABLED', // to access ecr repo
          subnets: ['subnet-0a6f77a9e242db996', 'subnet-09984f4c6c9526527'],
          securityGroups: ['sg-022fe6d8f6eaee5b7'],
        },
      },
    })
    const response = await client.send(command)
    console.log(response)
  } catch (e) {
    console.log(e)
  }
})()
