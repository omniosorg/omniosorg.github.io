---
layout: page
title: Downloads
order: 60
show_in_menu: false
show_in_sidebar: false
---

# OmniOS Downloads

Even-numbered releases of OmniOS are stable and odd-numbered releases are
unstable (bloody); see [stable vs. bloody](/about/stablevsbloody.html) for
more information on the differences between them. Our
[release schedule](/schedule.html) has more information on the
versions below and their end-of-support dates.

Please refer to the [installation walk-through](/setup/freshinstall.html)
for more information on how to install a fresh system.
All OmniOS releases are for the x86-64 architecture only.

<div class="mirror-select">
  <div>
	Choose Download Mirror:
  </div>
  <div class="mirror-list">
        <img src="/assets/flags/blank.gif" class="flag flag-ch" alt="Swiss Flag" />
	<a href="/download.html">Switzerland</a>
	<br />
        <img src="/assets/flags/blank.gif" class="flag flag-us" alt="US Flag" />
	<span class="selected">US East (selected)</span>
  </div>
  <div class="cleft"></div>
</div>

## Current Stable Release

Stable releases come out approximately every six months and are supported for
a year after release.

The current stable release is {{site.omnios_stable}} and was released on
{{site.omnios_stable_date}}:

{:.bordered .responsive-table}
| <a href="{{site.useast_path}}/stable/{{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.iso"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.iso</a> | ISO | <a href="{{site.download_path}}/stable/{{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.iso.sha256" class="orange-text">(SHA256)</a>
| <a href="{{site.useast_path}}/stable/{{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.usb-dd"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.usb-dd</a> | USB | <a href="{{site.download_path}}/stable/{{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.usb-dd.sha256" class="orange-text">(SHA256)</a>
| <a href="{{site.useast_path}}/stable/{{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.zfs.xz"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.zfs.xz</a> | PXE | <a href="{{site.download_path}}/stable/{{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.zfs.xz.sha256" class="orange-text">(SHA256)</a>
| <a href="/setup/aws.html"><i class="fab fa-lg fa-aws"></i> Amazon Machine Images</a> | AMI |
| <a target="_blank" href="{{site.useast_path}}/stable/"><i class="flow-text material-icons">cloud_download</i> Other stable downloads</a>

## Long-term support (LTS) Release

Every fourth stable release is a long-term support (LTS) release. LTS
releases are supported for three years.

The current LTS release is {{site.omnios_lts}} and was released on
{{site.omnios_lts_date}}:

{:.bordered .responsive-table}
| <a href="{{site.useast_path}}/lts/{{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.iso"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.iso</a> | ISO | <a href="{{site.download_path}}/lts/{{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.iso.sha256" class="orange-text">(SHA256)</a>
| <a href="{{site.useast_path}}/lts/{{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.usb-dd"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.usb-dd</a> | USB | <a href="{{site.download_path}}/lts/{{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.usb-dd.sha256" class="orange-text">(SHA256)</a>
| <a href="{{site.useast_path}}/lts/{{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.zfs.xz"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.zfs.xz</a> | PXE | <a href="{{site.download_path}}/lts/{{site.download_prefix}}{{site.omnios_lts}}{{site.omnios_lts_suffix}}.zfs.xz.sha256" class="orange-text">(SHA256)</a>
| <a target="_blank" href="{{site.useast_path}}/lts/"><i class="flow-text material-icons">cloud_download</i> Other LTS downloads</a>

## Bloody

Bloody media is built on an ad-hoc basis and is not supported. However, if
you want to experiment with the latest features and updates, then please
use these media and let us know how you get on.

{:.bordered .responsive-table}
| <a href="{{site.useast_path}}/bloody/{{site.download_prefix}}bloody-{{site.omnios_bloody}}.iso"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}bloody-{{site.omnios_bloody}}.iso</a> | ISO | <a href="{{site.download_path}}/bloody/{{site.download_prefix}}bloody-{{site.omnios_bloody}}.iso.sha256" class="orange-text">(SHA256)</a>
| <a href="{{site.useast_path}}/bloody/{{site.download_prefix}}bloody-{{site.omnios_bloody}}.usb-dd"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}bloody-{{site.omnios_bloody}}.usb-dd</a> | USB | <a href="{{site.download_path}}/bloody/{{site.download_prefix}}bloody-{{site.omnios_bloody}}.usb-dd.sha256" class="orange-text">(SHA256)</a>
| <a href="{{site.useast_path}}/bloody/{{site.download_prefix}}bloody-{{site.omnios_bloody}}.zfs.xz"><i class="flow-text material-icons">cloud_download</i> {{site.download_prefix}}bloody-{{site.omnios_bloody}}.zfs.xz</a> | PXE | <a href="{{site.download_path}}/bloody/{{site.download_prefix}}bloody-{{site.omnios_bloody}}.zfs.xz.sha256" class="orange-text">(SHA256)</a>
| <a target="_blank" href="{{site.useast_path}}/bloody/"><i class="flow-text material-icons">cloud_download</i> Other bloody downloads</a>
