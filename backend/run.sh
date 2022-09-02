#!/bin/bash
# Runs GIF folder

# Set display to Raspberry Pi [0.0]
DISPLAY=:0.0 \
mplayer \
-slave \
-fixed-vo \
-idle \
-fs \
-really-quiet \
-loop 0 \
./media/playing/*.gif

# Flag documentation: https://www.systutorials.com/docs/linux/man/1-mplayer/
# Config boot script here:
# sudo nano /etc/rc.local