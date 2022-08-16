https://docs.aws.amazon.com/ko_kr/AmazonECS/latest/developerguide/task_definition_parameters.html

https://github.com/buildkite/ecs-run-task
- PolicyName: ECSRunTask
  PolicyDocument:
    Version: '2012-10-17'
    Statement:
    - Effect: Allow
      Action:
        - ecs:RegisterTaskDefinition
        - ecs:DeregisterTaskDefinition
        - ecs:RunTask
        - ecs:DescribeTasks
        - logs:DescribeLogGroups
        - logs:DescribeLogStreams
        - logs:CreateLogStream
        - logs:PutLogEvents
        - logs:FilterLogEvents
      Resource: '*'

https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ecs/run-task.html


https://stackoverflow.com/questions/71355442/aws-javascript-sdk-retrieving-shell-output-from-ecs-execute-command

https://stackoverflow.com/questions/71355442/aws-javascript-sdk-retrieving-shell-output-from-ecs-execute-command


docker -it exec container-name /bin/sh
kubectl exec --stdin --tty pod-name -- /bin/bash
aws ecs execute-command \
--region $REGION \
--cluster $CLUSTER_NAME \
--task $TASKID \
--container $CONTAINER_NAME \
--command "/bin/sh" \
--interactive


https://sysdig.com/blog/secure-aws-ecs-exec/


