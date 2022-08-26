import { ECSClient, RunTaskCommand, RegisterTaskDefinitionCommand } from "@aws-sdk/client-ecs" // ES Modules import
const config = {}


const client = new ECSClient(config)
const command = new RunTaskCommand({taskDefinition:''})
const response = await client.send(command)
console.log('hello world')
