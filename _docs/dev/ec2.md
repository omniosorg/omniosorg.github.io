---
title: Creating an EC2 AMI
category: dev
show_in_sidebar: true
---

# Creating an EC2 Amazon Machine Image (AMI)

Part of the OmniOS distribution media is a set of disk images in various
formats which are suitable for using in a cloud environment such as AWS EC2.

These cloud images are available on [our downloads page](/download.html).

Converting these images into an AMI ready to run is fairly straightforward:
1. Upload the image to an S3 bucket;
1. Import the image into an Elastic Block Store (EBS) snapshot;
1. Create an AMI from the snapshot;
1. Clean up the S3 bucket.

### Setting up the AWS cli

If you're doing this on OmniOS, then the easiest way to set up the AWS
command line interface is through a Python virtual environment (venv).
This example uses an environment called `awscli`.

```bash
$ python3 -mvenv awscli
$ . awscli/bin/activate
(awscli) $ pip install awscli
```

Place your AWS access key and secret key and your preferred region in the
AWS cli configuration file at `~/.aws/config`, for example:

```ini
[default]
aws_access_key_id=XXXXXXXXXXXXXXXXXXXX
aws_secret_access_key=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
region=eu-central-1
```

At this point you should be able to run `aws` commands, for example try:

```bash
$ aws ec2 describe-regions
```

### Uploading the image to an S3 bucket

Assuming you have an S3 bucket called `mybucket`, you can upload the
cloud VMDK image directly:

```bash
$ aws s3 cp omnios-r151042.cloud.vmdk s3://mybucket/omnios-r151042.cloud.vmdk
$ aws s3 ls mybucket
2022-07-22 11:26:16  653241856 omnios-r151042.cloud.vmdk
```

### Import the image into an EBS snapshot

Prepare a JSON file to describe the import operation. For the image uploaded
above this would look something like this where `Description` is what you
want to call the snapshot and `S3Key` is the name of the file you placed
in S3.

```json
{
    "Description": "omnios-r151042.cloud",
    "Format" : "vmdk",
    "UserBucket": {
        "S3Bucket": "mybucket",
        "S3Key": "omnios-r151042.cloud.vmdk"
    }
}
```

Now import the snapshot:

```bash
$ aws ec2 import-snapshot --disk-container file://disk.json
```

and monitor this job using:

```bash
$ aws ec2 describe-import-snapshot-tasks
```

until the output shows a `Status` field showing that the job has completed:

```json
{
    "ImportSnapshotTasks": [
        {
            "ImportTaskId": "import-snap-xxxxxxxxxxxxxxxxx",
            "SnapshotTaskDetail": {
                "DiskImageSize": 653241856.0,
                "Format": "VMDK",
                "SnapshotId": "snap-xxxxxxxxxxxxxxxxx",
                "Status": "completed",
                "UserBucket": {
                    "S3Bucket": "mybucket",
                    "S3Key": "omnios-r151042.cloud.vmdk"
                }
            },
            "Tags": []
        }
    ]
}
```

### Create the AMI

The last step is to create the AMI. Prepare a JSON file to describe the
target based on this template. The `SnapshotID` field must be set to the
same value as shown in the previous status command.

```json
{
    "Architecture": "x86_64",
    "Description": "OmniOS illumos distribution",
    "EnaSupport": true,
    "Name": "OmniOS r151042",
    "RootDeviceName": "/dev/xvda",
    "BlockDeviceMappings": [
        {
            "DeviceName": "/dev/xvda",
            "Ebs": {
                "SnapshotId": "snap-xxxxxxxxxxxxxxxxx"
            }
        }
    ],
    "VirtualizationType": "hvm",
    "BootMode": "uefi"
}
```

and import:

```bash
$ aws ec2 register-image --cli-input-json file://image.json
```

This should return quite quickly and show the assigned AMI ID

```json
{
    "ImageId": "ami-001205af9d507d439"
}
```

