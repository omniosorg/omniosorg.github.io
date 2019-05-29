---
title: AWS EC2 Image
category: setup
order: 90
show_in_sidebar: true
---

# OmniOS Installation in the Amazon Cloud

OmniOS is provided as a public Amazon Machine Image (AMI) within some
regions in the Amazon Cloud; you can have a virtual OmniOS server up and
running within a couple of minutes.
The image is small so can be run within the free tier - a `t2.micro` instance
is perfect for experimentation.

### r151030 (LTS)

{:.bordered .responsive-table}
| Region(s) | AMI ID | AMI Name
| --------- | ------ | --------
| EU (Frankfurt)	| ami-05c391bd80dcc7998 | r151030 stable 20190529
| EU (London)		| TBC | r151030 stable 20190529
| EU (Ireland)		| TBC | r151030 stable 20190529
| EU (Paris)		| TBC | r151030 stable 20190529
| US (Oregon)		| TBC | r151030 stable 20190529
| US (N.California)	| TBC | r151030 stable 20190529
| US (Ohio)		| TBC | r151030 stable 20190529
| US (N.Virginia)	| TBC | r151030 stable 20190529
| Canada		| TBC | r151030 stable 20190529
| S.America (Sao Paulo)	| TBC | r151030 stable 20190529
| Asia Pacific (Tokyo)	| TBC | r151030 stable 20190529
| Asia Pacific (Seoul)	| TBC | r151030 stable 20190529
| Asia Pacific (Mumbai)	| TBC | r151030 stable 20190529
| Asia Pacific (Singapore)	| TBC | r151030 stable 20190529
| Asia Pacific (Sydney)	| TBC | r151030 stable 20190529

### r151026

{:.bordered .responsive-table}
| Region(s) | AMI ID | AMI Name
| --------- | ------ | --------
| EU (Frankfurt)	| ami-07e7a072121af904b | r151026 stable 20180507
| EU (London)		| ami-0e815515b2fe8f7b3 | r151026 stable 20180507
| EU (Ireland)		| ami-072c2a2ffb7e97761 | r151026 stable 20180507
| EU (Paris)		| ami-0864714f1fe8631ff | r151026 stable 20180507
| US (Oregon)		| ami-09e271c1e0f163eca | r151026 stable 20180507
| US (N.California)	| ami-0d2d11f5075cc9845 | r151026 stable 20180507
| US (Ohio)		| ami-0169c5108d1bdfd57 | r151026 stable 20180507
| US (N.Virginia)	| ami-0b2c7fd1c1f7e91d6 | r151026 stable 20180507
| Canada		| ami-0413ce96dc9426f86 | r151026 stable 20180507
| S.America (Sao Paulo)	| ami-05d9d52506d57b653 | r151026 stable 20180507
| Asia Pacific (Tokyo)	| ami-037d1630e373179ff | r151026 stable 20180507
| Asia Pacific (Seoul)	| ami-07f5fd6fa34316773 | r151026 stable 20180507
| Asia Pacific (Mumbai)	| ami-06ef85f830ecd879f | r151026 stable 20180507
| Asia Pacific (Singapore)	| ami-036737039cf84b8bf | r151026 stable 20180507
| Asia Pacific (Sydney)	| ami-04db88805d27f8c74 | r151026 stable 20180507

### r151024

{:.bordered .responsive-table}
| Region(s) | AMI ID | AMI Name
| --------- | ------ | --------
| EU (Frankfurt)	| ami-cc56d7a3 | r151024 stable 20171113

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

