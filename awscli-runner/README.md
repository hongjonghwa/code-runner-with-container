# register

aws ecs register-task-definition --cli-input-json file://./fargate-task.json

# list task

aws ecs list-task-definitions --output text

# 80/443 sg: sg-06ef859797025f59d

# no in/out sg: sg-022fe6d8f6eaee5b7

# run

aws ecs run-task \
 --task-definition sample-fargate \
 --cluster CodeRunnerCluster \
 --launch-type FARGATE \
 --network-configuration "awsvpcConfiguration={assignPublicIp=ENABLED,subnets=[subnet-0a6f77a9e242db996,subnet-09984f4c6c9526527],securityGroups=[sg-06ef859797025f59d]}"

# log

aws logs tail "/CodeRunner/userTaskLog"
aws logs get-log-events --log-group-name=/CodeRunner/userTaskLog --log-stream-name=test-run/fargate-app/5193b43007d24e37b4302e77932096c2

# describe

aws ecs list-task-definitions --task-definition sample-fargate -o text

# deregister

aws ecs deregister-task-definition --task-definition sample-fargate:13

# execute 실행

https://docs.aws.amazon.com/ko_kr/AmazonECS/latest/developerguide/ecs-exec.html

```json
{
    "tasks": [
        {
            ...
            "containers": [
                {
                    ...
                    "managedAgents": [
                        {
                            "lastStartedAt": "2021-03-01T14:49:44.574000-06:00",
                            "name": "ExecuteCommandAgent",
                            "lastStatus": "RUNNING"
                        }
                    ]
                }
            ],
            ...
            "enableExecuteCommand": true,
            ...
        }
    ]
}
```

```sh
aws ecs execute-command --cluster cluster-name \
    --task task-id \
    --container container-name \
    --interactive \
    --command "/bin/sh"
```
