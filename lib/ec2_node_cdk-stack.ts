import * as AWS from 'aws-sdk'
import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as iam from '@aws-cdk/aws-iam'
import { config } from './config'


/**
 * Asynchronously gets the AMI ID of a an image
 * 
 * @param  {string} imageName the search term for the image. can use *, ? wildcards
 * @param  {string} region the region to search in
 * @returns Promise
 */
const getAMIImageID = async(
  imageName: string,
  region: string
): Promise<string | undefined> => {
  const ec2 = new AWS.EC2({ region })

  const params = {
    Filters: [
      {
        Name: 'block-device-mapping.volume-type',
        Values: ['gp2'],
      },
      {
        Name: 'name',
        Values: [imageName],
      },
      {
        Name: 'state',
        Values: ['available'],
      },
    ],
  }

  try {
    const data = await ec2.describeImages(params).promise()

    // sort the return data by date descending and 
    // return the first element in the array
    const imageInfo = data.Images?.sort(
      (a, b) => +new Date(b.CreationDate || 0) - +new Date(a.CreationDate || 0)
    )[0]

    return imageInfo?.ImageId
  } catch (error) {
    console.error('[getAMIImageID]', error)
    return
  }
}

export class Ec2NodeCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: config.stack })

    // just use region default vpc 
    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    // define the IAM role that will allow the EC2 instance to communicate with SSM
    const role = new iam.Role(this, 'TNBSSMInstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    })

    // arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    )
    try {
      ;(async () => {
        // this image has SSM pre-installed
        const amiID = await getAMIImageID(config.tnb.amiImageSearchTerm, config.stack.region)
  
        // create bank and validator
        for(const instanceName of [config.tnb.bankName, config.tnb.validatorName]) {
          new ec2.Instance(this, `${instanceName}`, {
            machineImage: ec2.MachineImage.genericLinux({
              [`${config.stack.region}`]: <string>amiID,
            }),
            instanceName,
            vpc: defaultVpc,
            role,
            instanceType: ec2.InstanceType.of(
              ec2.InstanceClass.T2,
              ec2.InstanceSize.MICRO
            )
          })
    
          // add tags
          cdk.Tags.of(this).add(instanceName, 'Name')

          // TODO
          // add user scripts
          // const ssmaUserData = ec2.UserData.forLinux()
          // ssmaUserData.addCommands(...config.startupCommands.bank)
          // ssmaUserData.addCommands(...config.startupCommands.validator)
        }
  
      })()
    } catch(error){
      console.error('[ec2.Instance]', error)
    }
  }
}
