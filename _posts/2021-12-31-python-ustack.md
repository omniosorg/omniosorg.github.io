---
layout: post
hide_post: false
title: Restoring the python dtrace ustack helper
synopsis: Restoring the python dtrace ustack helper
---

Prior to version r151034, the Python versions shipped with OmniOS included
a patch which added support for a small number of
[dtrace](https://man.omnios.org/man1m/dtrace) probes around function
entry and exit, and also a **dtrace ustack helper**. A ustack helper allows a
stack trace examined in the context of a dtrace probe to be annotated with
useful information; in the case of python, information about the python program
stack.

When dtrace support was integrated into the official cpython release of Python,
in version 3.6,
[the ustack helper was omitted](https://hg.python.org/cpython/rev/d622dbd71f2b).
This meant that when OmniOS upgraded to Python 3.7 along with the move to
using the built-in dtrace support, the ustack helper was no longer available.
We recently revisited this and have just completed restoring the feature
to Python 3.10 in OmniOS bloody, which will be the basis for the next stable
release in May 2022. This is mostly derived from the original
[Solaris patch for python 3.5](https://github.com/oracle/solaris-userland/blob/d633dcec1ae67547cc2c68444ac048494f3b0975/components/python/python35/patches/00-dtrace.patch).
The python patch for OmniOS is being maintained
[in a github branch](https://github.com/omniosorg/cpython/tree/ustack-3.10.1).

We have opted to include this in a separate debug variant of the package since
there are some performance overheads in providing the helper, even if it is not
used. For it to work reliably, python itself needs to be built without
optimisations, every loaded module needs to have a second copy of the line
number information stored in a format that is usable by dtrace, and every
function call needs to go through another stack frame to ensure that the
necessary information ends up on the stack in a place that dtrace can find it.
There's a little more on this in John Levon's blog post on the
[original python dtrace implementation](https://movementarian.org/blog/posts/2007-05-24-python-and-dtrace-in-build-65).

As an example, I was recently debugging a problem with the OmniOS packaging
system unexpectedly removing a directory. Reaching for dtrace to check when the
`rmdir` system call is used is not particularly helpful since you only see the
stack trace from the cpython process.

```
% pfexec dtrace -n 'syscall::rmdir:entry{trace(copyinstr(arg0));jstack()}' \
    -c 'pkg image-create -f /tmp/testimg'

  1  246  rmdir:entry   /tmp/testimg/.org.opensolaris,pkg/publisher
   libc.so.1`_syscall6+0x1b
   libpython3.10.so.1.0`os_rmdir+0x102
   libpython3.10.so.1.0`cfunction_vectorcall_FASTCALL_KEYWORDS+0x61
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x57b4
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x57b4
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`method_vectorcall+0x8c
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1663
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`_PyObject_FastCallDictTstate+0x108
   libpython3.10.so.1.0`_PyObject_Call_Prepend+0x73
   libpython3.10.so.1.0`slot_tp_init+0x89
   libpython3.10.so.1.0`type_call+0x10b
   libpython3.10.so.1.0`_PyObject_MakeTpCall+0x126
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x6030
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1663
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x3ef
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x30b0
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x3ef
   libpython3.10.so.1.0`_PyEval_Vector+0x45
   libpython3.10.so.1.0`PyEval_EvalCode+0x96
   libpython3.10.so.1.0`run_eval_code_obj+0x56
   libpython3.10.so.1.0`run_mod+0x6d
   libpython3.10.so.1.0`pyrun_file+0x81
   libpython3.10.so.1.0`_PyRun_SimpleFileObject+0x395
   libpython3.10.so.1.0`_PyRun_AnyFileObject+0x8b
   libpython3.10.so.1.0`Py_RunMain+0x3d6
   libpython3.10.so.1.0`Py_BytesMain+0x3c
   python3.10`_start_crt+0x87
   python3.10`_start+0x18
```

With this new update, the debug python variant with the ustack helper can
easily be switched in.

```
% pfexec pkg change-variant debug.python=true
            Packages to change:  1
     Variants/Facets to change:  1
       Create boot environment: No
Create backup boot environment: No

DOWNLOAD                                PKGS         FILES    XFER (MB)   SPEED
Completed                                1/1     2556/2556    14.5/14.5      --

PHASE                                          ITEMS
Installing new actions                           2/2
Updating modified actions                  2554/2554
Updating package state database                 Done
Updating package cache                           0/0
Updating image state                            Done
Creating fast lookup database                   Done
Reading search index                            Done
Building new search index                    689/689
```

and now the same stack trace is annotated with the python program information
(the indented parts shown in square brackets).

```
 10  246  rmdir:entry   /tmp/testimg/.org.opensolaris,pkg/publisher
   libc.so.1`_syscall6+0x1b
   libpython3.10.so.1.0`os_rmdir+0x282
   libpython3.10.so.1.0`cfunction_vectorcall_FASTCALL_KEYWORDS+0x5b
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0xaf11
     [ /usr/lib/python3.10/shutil.py:708 (rmtree) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0xaf11
     [ /usr/lib/python3.10/vendor-packages/pkg/client/image.py:1971 (__set_dirs) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`method_vectorcall+0x185
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0x6dd2
     [ /usr/lib/python3.10/vendor-packages/pkg/client/image.py:711 (__init__) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`_PyObject_FastCallDictTstate+0xfa
   libpython3.10.so.1.0`_PyObject_Call_Prepend+0x112
   libpython3.10.so.1.0`slot_tp_init+0xd9
   libpython3.10.so.1.0`type_call+0x8f
   libpython3.10.so.1.0`_PyObject_MakeTpCall+0xa1
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0x9db5
     [ /usr/lib/python3.10/vendor-packages/pkg/client/api.py:6749 (image_create) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0x6dd2
     [ /usr/bin/pkg:6284 (image_create) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0x756f
     [ /usr/bin/pkg:8042 (main_func) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0x5326
     [ /usr/bin/pkg:6191 (handle_errors) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`_PyEval_EvalFrameDefaultReal+0x756f
     [ /usr/bin/pkg:8182 (<module>) ]
   libpython3.10.so.1.0`_PyEval_EvalFrameDefault+0x1c
   libpython3.10.so.1.0`_PyEval_Vector+0x48
   libpython3.10.so.1.0`PyEval_EvalCode+0x91
   libpython3.10.so.1.0`run_eval_code_obj+0x54
   libpython3.10.so.1.0`run_mod+0x6c
   libpython3.10.so.1.0`pyrun_file+0x80
   libpython3.10.so.1.0`_PyRun_SimpleFileObject+0x124
   libpython3.10.so.1.0`_PyRun_AnyFileObject+0x44
   libpython3.10.so.1.0`Py_RunMain+0x451
   libpython3.10.so.1.0`Py_BytesMain+0x57
   python3.10`_start_crt+0x87
   python3.10`_start+0x18
```

Here are those lines extracted, and it's easy to see that the place to start
looking is around line 1971 in the `__set_dirs` function of `image.py`.

```
[ /usr/lib/python3.10/shutil.py:708 (rmtree) ]
[ /usr/lib/python3.10/vendor-packages/pkg/client/image.py:1971 (__set_dirs) ]
[ /usr/lib/python3.10/vendor-packages/pkg/client/image.py:711 (__init__) ]
[ /usr/lib/python3.10/vendor-packages/pkg/client/api.py:6749 (image_create) ]
[ /usr/bin/pkg:6284 (image_create) ]
[ /usr/bin/pkg:8042 (main_func) ]
[ /usr/bin/pkg:6191 (handle_errors) ]
[ /usr/bin/pkg:8182 (<module>) ]
```

To switch back to the production version of python:

```
% pfexec pkg change-variant debug.python=false
```

