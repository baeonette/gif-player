#!/bin/bash
# Runs GIF folder

DISPLAY=:0.0 \
chromium-browser \
http://localhost:3000/api/ftp/playing$1

# Flag documentation: https://www.systutorials.com/docs/linux/man/1-mplayer/
# Config boot script here:
# sudo nano /etc/rc.local