#!/bin/bash

while ./clipnotify/clipnotify;
do
  node index.js | espeak -v gmw/en -g 01ms -a 110 -p 58 -s 175
done
