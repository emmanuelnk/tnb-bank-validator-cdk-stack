# The New Boston Currency Bank and Validator EC2 Deploy Stack
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)
[![Twitter](https://img.shields.io/twitter/follow/emmanuel_n_k?style=social)](https://twitter.com/emmanuel_n_k)

This is an easy way to deploy the EC2s used in the The New Boston Tutorial series using the AWS CDK and written in Typescript. Used for setting up test validator and bank EC2s in the TNB Currency Network. See the video [here](https://www.youtube.com/watch?v=6VJOZcjuoS4.)

## Key Features
- No need for SSH keys or PEM files! It uses AWS SSM! Just run this to log into your instance:
 ```
aws ssm start-session --target "i-XXXXXXXXXXXXX"
```

This was made for tutorial purposes and this stack is very alpha so please do not use it in production unitl you've gone over all the security best practices.

## Install Guide
Make sure you have these defined in `~/.aws/credentials`:
```bash
[default]
aws_access_key_id=XXXXxxxxXXXXXxXXXxxX
aws_secret_access_key=XXXXxxxxXXXXXxXXXxxX
```
Install aws-cli if you haven't already:
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```
Install the aws-cdk cli:
```bash
npm install -g aws-cdk
cdk --version
```
Install the project dependencies:
```bash
npm install
```
Configure the necessary parameters in `lib/config.ts`
```ts
export const config = {
    stack: {
        account: process.env.AWS_ACCOUNT_NUMBER,
        region: 'us-west-2'
    },
    tnb: {
        validatorName: 'test-validator',
        bankName: 'test-bank',
        amiImageSearchTerm: 'ubuntu*20.04-amd64-server*'
    }
}
```
That's it! Then you deploy the stack (you will get prompted to confirm the stack (y/n) before it deploys, don't worry!)
```bash
cdk deploy
```
You will need SSM plugin to talk to your EC2s using SSM:
```bash
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" \
-o "session-manager-plugin.deb"
sudo dpkg -i session-manager-plugin.deb
```
When the stack is successfully deployed and the ec2 instances are runnning, you can now use SSM to SSH into them. Get the instance ids
```bash
aws ec2 describe-instances --query "Reservations[*].Instances[*].[Tags, InstanceId]"
```
And then open a session:
```bash
aws ssm start-session --target "i-XXXXXXXXXXXXX"
```

## TODO

- [ ] Install script for bank 
- [ ] Install script for validator

##

- All Contibutions are welcome. If you want to add something just open up an issue or make a pull request.
