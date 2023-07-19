#!/bin/bash

set -eu
make migrate
make reset

tail -f /dev/null