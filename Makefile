##    Copyright (C) 2012 Oleg Kertanov <okertanov@gmail.com>
##    All rights reserved.

MODULE_NAME := garagesale

all:

clean:

update:
	env -i git pull --ff-only --force origin
	env -i git submodule update --init --recursive

.DEFAULT: all

.PHONY: all update clean

.SILENT: clean

