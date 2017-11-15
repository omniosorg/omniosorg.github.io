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

{:.bordered .responsive-table}
| Region(s) | AMI ID | AMI Name
| --------- | ------ | --------
| EU (Frankfurt) | ami-cc56d7a3 | OmniOSce r151024 stable 20171113

If you wish to run an image in a different region then please
[get in touch](/about/contact.html) and we will make it (and future
releases) available there.
Alternatively, you can copy the image to a private AMI within another region
yourself via the EC2 dashboard and launch it from there.

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
<img src="https://omniosce.org/assets/images/support.png" align="left">
</a>

OmniOS Community Edition has no major company behind it, just a small
team of people who spend their precious spare time keeping it up-to-date.
If you rely on OmniOS for fun or business, and you want to help secure
its future, you can contribute by becoming an
[OmniOS patron](https://omniosce.org/patron).

