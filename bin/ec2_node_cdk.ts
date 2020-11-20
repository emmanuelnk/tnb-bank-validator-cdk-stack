#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Ec2NodeCdkStack } from '../lib/ec2_node_cdk-stack';

const app = new cdk.App();
new Ec2NodeCdkStack(app, 'Ec2NodeCdkStack');
