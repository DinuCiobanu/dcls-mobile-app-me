#!/bin/bash
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf package-lock.json
rm -rf ./node_modules
