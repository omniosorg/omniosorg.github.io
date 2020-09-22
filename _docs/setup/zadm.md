---
title: 'zadm' walk-through series
category: setup
show_in_sidebar: true
---

# zadm - Zone Management Tool

This is a series of ascii-casts showing how to use the `zadm` zone management
tool to create and manage zones on OmniOS from release r151034. New videos
will be posted to this page over the coming weeks.

## Using zadm to create an lx zone

This week's cast shows how to use `zadm` to quickly create an
_lx_-branded zone and how to configure a basic policy in the zone firewall.
The zone firewall works for all zone brands except for _KVM_ and is ideal for
securing an lx zone where the native iptables tools don't work.

> nginx is used as an example application here, but in reality one would
> deploy something like nginx in a native branded zone, most likely with
> the _sparse_ brand.

This is just a basic zone setup. Configuring more features such as memory
and CPU caps will be covered in a future post.

<script id="asciicast-360901" src="https://asciinema.org/a/360901.js" async>
</script>

