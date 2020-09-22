---
layout: post
title: Using the 'zadm' utility to create an lx zone
synopsis: Using the 'zadm' utility to create an lx zone
---

This week's ascii-cast shows how to use `zadm` to quickly create an
_lx_-branded zone in OmniOS r151034 and how to configure a basic policy in
the zone firewall. The zone firewall works for all zone brands except for
_KVM_ and is ideal for securing an lx zone where the native iptables
tools don't work.

> nginx is used as an example application here, but in reality one would
> deploy something like nginx in a native branded zone, most likely with
> the _sparse_ brand.

This is just a basic zone setup. Configuring more features such as memory
and CPU caps will be covered in a future article.

<script id="asciicast-360901" src="https://asciinema.org/a/360901.js" async>
</script>

---

<i class="fab fa-lg fa-pull-left fa-github"></i> [zadm](https://github.com/omniosorg/zadm) is open source and hosted on Github. Feedback and pull requests
are welcome.

Any questions, please [get in touch](/about/contact.html)!

