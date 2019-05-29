---
title: AWS EC2 Image
category: setup
order: 90
layout: page_wide
show_in_sidebar: true
---

# OmniOS Installation in the Amazon Cloud

OmniOS is provided as a public Amazon Machine Image (AMI) within some
regions in the Amazon Cloud; you can have a virtual OmniOS server up and
running within a couple of minutes.
The image is small so can be run within the free tier - a `t2.micro` instance
is perfect for experimentation.

## r151030 (LTS)

{:.bordered .responsive-table}
| Region | Name | AMI ID
| ------ | ---- | --------
| eu-central-1 | EU (Frankfurt) | ami-0ad303949e19f897a
| eu-north-1 | EU (Stockholm) | ami-0d76cb8752ad73ab1
| eu-west-1 | EU (Ireland) | ami-0f38cdec7da648424
| eu-west-2 | EU (London) | ami-0127cb92c2ac61534
| eu-west-3 | EU (Paris) | ami-0083960c1530c641f
| us-east-1 | US East (N. Virginia) | ami-0a01a5636f3c4f21c
| us-east-2 | US East (Ohio) | ami-0a02eadc6d8770f83
| us-west-1 | US West (N. California) | ami-0bbeea654a35ef611
| us-west-2 | US West (Oregon) | ami-0a1af68029fa293b6
| sa-east-1 | South America (São Paulo) | ami-059c26b020488b2f7
| ap-northeast-1 | Asia Pacific (Tokyo) | ami-06f36024e5686942b
| ap-northeast-2 | Asia Pacific (Seoul) | ami-06dc38c370d99b344
| ap-south-1 | Asia Pacific (Mumbai) | ami-07539529fd98896eb
| ap-southeast-1 | Asia Pacific (Singapore) | ami-01c8f677b79c2744f
| ap-southeast-2 | Asia Pacific (Sydney) | ami-0a351e7460c633be1
| ca-central-1 | Canada (Central) | ami-04dc095f40f53ef3b

## r151026

{:.bordered .responsive-table}
| Region | Name | AMI ID
| ------ | ---- | --------
| eu-central-1 | EU (Frankfurt) | ami-07e7a072121af904b
| eu-west-1 | EU (Ireland) | ami-072c2a2ffb7e97761
| eu-west-2 | EU (London) | ami-0e815515b2fe8f7b3
| eu-west-3 | EU (Paris) | ami-0864714f1fe8631ff
| us-east-1 | US East (N. Virginia) | ami-0b2c7fd1c1f7e91d6
| us-east-2 | US East (Ohio) | ami-0169c5108d1bdfd57
| us-west-1 | US West (N. California) | ami-0d2d11f5075cc9845
| us-west-2 | US West (Oregon) | ami-09e271c1e0f163eca
| sa-east-1 | South America (São Paulo) | ami-05d9d52506d57b653
| ap-northeast-1 | Asia Pacific (Tokyo) | ami-037d1630e373179ff
| ap-northeast-2 | Asia Pacific (Seoul) | ami-07f5fd6fa34316773
| ap-south-1 | Asia Pacific (Mumbai) | ami-06ef85f830ecd879f
| ap-southeast-1 | Asia Pacific (Singapore) | ami-036737039cf84b8bf
| ap-southeast-2 | Asia Pacific (Sydney) | ami-04db88805d27f8c74
| ca-central-1 | Canada (Central) | ami-0413ce96dc9426f86

## r151024

{:.bordered .responsive-table}
| Region | Name | AMI ID
| ------ | ---- | --------
| eu-central-1 | EU (Frankfurt) | ami-cc56d7a3

## Launching an instance

To launch an instance, visit the EC2 dashboard, select the correct region
from the drop-down menu at the top right and then click on _Launch Instance_

![EC2 Dashboard](../assets/images/ec2_launch.png?raw=true "EC2 Dashboard")

On the next screen, select _Community AMIs_ on the left-hand-side and then
search for OmniOS to find the AMI.

![EC2 AMIs](../assets/images/ec2_ami.png?raw=true "EC2 AMIs")

> Please check the AMI ID against the table above to ensure you're choosing
> one of our official images.

## Support Us

<a href="https://omniosce.org/patron">
<img src="https://omniosce.org/assets/images/support.png" alt="Support Us" align="left">
</a>

OmniOS Community Edition has no major company behind it, just a small
team of people who spend their precious spare time keeping it up-to-date.
If you rely on OmniOS for fun or business, and you want to help secure
its future, you can contribute by becoming an
[OmniOS patron](https://omniosce.org/patron).

