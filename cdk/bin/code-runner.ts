#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CodeRunnerStack } from '../lib/code-runner-stack';

const app = new cdk.App();
new CodeRunnerStack(app, 'CodeRunnerStack');
