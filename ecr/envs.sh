#!/usr/bin/env bash

export AWS_REGION=$(aws configure get region)
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity | grep Account | head -n 1 |  sed 's/[^0-9.]*//g')
export AWS_ECR_REPOSITORY=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
