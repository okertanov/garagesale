##    Copyright (C) 2012 Oleg Kertanov <okertanov@gmail.com>
##    All rights reserved.

MODULE_NAME := garagesale

SRC_DIR  := src
SERVER   := server.js

PID_FILE := log/run.pid
OUT_FILE := log/output.log
ERR_FILE := log/error.log
LOG_FILE := log/run.log

FRV_OPTIONS = --pidFile $(PID_FILE) --sourceDir $(SRC_DIR) \
              --watch --watchDirectory $(SRC_DIR) \
              --append -l $(LOG_FILE) -e $(ERR_FILE) -o $(OUT_FILE)

all:
	-@echo "------------------------------------------------"
	-@echo "Targets are: start, stop, restart, update, clean"
	-@echo "------------------------------------------------"

start:
	-@echo "------------------------------------------------"
	forever start $(FRV_OPTIONS) $(SERVER)
	-@echo "------------------------------------------------"

stop:
	-@echo "------------------------------------------------"
	forever stop $(FRV_OPTIONS) $(SERVER)
	-@echo "------------------------------------------------"

restart:
	-@echo "------------------------------------------------"
	forever restart $(FRV_OPTIONS) $(SERVER)
	-@echo "------------------------------------------------"

update:
	-@echo "------------------------------------------------"
	@env -i git pull --ff-only --force origin
	@env -i git submodule update --init --recursive
	-@echo "------------------------------------------------"

clean:

.DEFAULT: all

.PHONY: all start stop restart update clean

.SILENT: clean

