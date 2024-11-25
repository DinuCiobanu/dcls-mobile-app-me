#!/usr/bin/env bash
# default build file type (apk | aab)
TYPE="apk"


if [ ! -z "$2" ]; then
  TYPE=$2;
fi

# rm -rf android/app/src/main/assets/*.bundle
# yarn bundle-android
# rm -rf android/app/src/main/res/raw/*
# rm -rf android/app/src/main/res/drawable-

cd android
if [ "$TYPE" = "apk" ]; then
 ./gradlew assembleRelease
fi

if [ "$TYPE" = "aab" ]; then
 ./gradlew bundleRelease
fi