---
layout: post
title: Setting up a virtual machine in Azure
synopsis: Setting up a virtual machine in Azure
---

With the release of OmniOS r151038, a hard disk image suitable for uploading
to [Microsoft Azure](https://azure.microsoft.com/) is available. This image
is pre-configured to run in Azure and can be provisioned directly from the
command line, using the Azure CLI, as shown below.

> This article assumes you already have the Azure CLI installed and working
> and that you have authenticated to Azure using the `az login` command.

The image is provided as a compressed virtual hard disk (vhd) file on the
OmniOS download site. In the following example, the image related to the
rolling _"bloody"_ release is used.

First, download the image to the local machine, and uncompress it:

```terminal
$ cd /tmp
$ curl -O https://downloads.omnios.org/media/bloody/azure-151037.vhd.zst
$ zstd -d azure-151037.vhd.zst
```

Create a resource group to hold the rest of the resources. If you already
have a resource group configured in Azure, you can skip this step. In this
example, the resource group is called _web_ and it is being created in the
_ukwest_ region.

```terminal
$ az group create --name web --location ukwest
```

Create a storage account to hold the disk image - again, if you already have
a storage account configured, you can skip this step.

```terminal
$ az storage account create --resource-group web --location ukwest \
    --name webstorage --kind Storage --sku Standard_LRS
```

Obtain the key needed to access this new storage account. This can also be
obtained using the Azure web portal. Setting the two environment variables
shown makes the following commands shorter as these parameters can then be
omitted.

```terminal
$ key=`az storage account keys list \
    --resource-group web --account-name webstorage \
    | jq -r 'first | .value'`

$ export AZURE_STORAGE_ACCOUNT=webstorage
$ export AZURE_STORAGE_KEY=$key
```

Create a container within the storage account. This is where the disk image
will be uploaded:

```terminal
$ az storage container create --name omniosdisk
```

Now the image can be uploaded, this will take a few minutes and you will
see a progress bar.

```terminal
$ az storage blob upload --container-name omniosdisk --type page \
    --file /tmp/azure-151037.vhd --name azure-151037.vhd
```

Once that is uploaded, it is time to create the virtual machine. In the
following example, an admin user is also being created with the username
`boho`. This account will be granted permission to use `sudo` and will be
configured with the provided public SSH key in its authorized_keys file.

```terminal
$ az vm create --resource-group web --location ukwest \
    --name web01 --storage-account webstorage --os-type linux \
    --admin-username boho --ssh-key-value ~/.ssh/id_rsa.pub \
    --size Standard_B1s --boot-diagnostics-storage=webstorage \
    --use-unmanaged-disk --image \
    https://$storage.blob.core.windows.net/omniosdisk/azure-151037.vhd
```

Once this is complete, a JSON object will be displayed which includes the
assigned public IP address for the VM:

```json
{
  "location": "ukwest",
  "powerState": "VM running",
  "publicIpAddress": "51.140.2xx.1xx"
}
```

If all went well, you should be able to SSH straight in using the provided
admin username and SSH key:

```terminal
$ ssh boho@51.140.2xx.1xx
The authenticity of host '51.140.2xx.1xx (51.140.2xx.1xx)' can't be established.
ECDSA key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
OmniOS r151037  omnios-master-0401360920        March 2021
boho@web01:~$
boho@web01:~$
boho@web01:~$ sudo -s
root@web01:/home/boho#
```

You can then proceed to add additional data disks to the machine as required
using the standard Azure CLI or web interface.

