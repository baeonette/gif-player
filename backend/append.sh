#!/bin/bash
# Runs GIF folder

mplayer \
-really-quiet \
-fixed-vo \ 
-idle \
-fs \
-loop 0 \
loadfile ./media/playing/$1.gif

# Flag documentation: https://www.systutorials.com/docs/linux/man/1-mplayer/
# Config boot script here:
# sudo nano /etc/rc.local