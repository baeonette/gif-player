#!/bin/bash
# Runs GIF folder

# Set display to Raspberry Pi [0.0]
DISPLAY=:0.0 \
mplayer \
-really-quiet \
-fixed-vo -idle \
-fs \
-loop 0 \
./media/playing/

# Flag documentation: https://www.systutorials.com/docs/linux/man/1-mplayer/
# Config boot script here:
# sudo nano /etc/rc.local