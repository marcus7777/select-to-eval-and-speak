#!/bin/bash

while ./clipnotify/clipnotify;
do
  node index.js | speak
done
