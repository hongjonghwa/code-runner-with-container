#!/usr/bin/env bash

if [[ $# -eq 0 ]] || [[ "$1" != *":"* ]] ; then
    echo 'Usage : deploy.sh <repo>:<tag>'
    exit 1
fi
if [[ "$(docker images -q $1 2> /dev/null)" == "" ]]; then
    echo "not found image \"${1}\""
    exit 1
 fi

. ./envs.sh
if [[ -z $AWS_REGION ]] || [[ -z $AWS_ACCOUNT_ID ]] || [[ -z $AWS_ECR_REPOSITORY ]] ; then
    echo 'Terminated with error'
    exit 1
fi

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR_REPOSITORY
docker tag $1 $AWS_ECR_REPOSITORY/$1
docker push $AWS_ECR_REPOSITORY/$1
