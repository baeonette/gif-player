#!/bin/bash
# Runs GIF folder

# Set display to Raspberry Pi [0.0]
DISPLAY=:0.0 \
chromium-browser \
--kiosk \
--app=http://localhost:3000/api/ftp/display
# Opens view with WebSockets to handle updating GIFs

# Flag documentation: https://www.systutorials.com/docs/linux/man/1-mplayer/
# Config boot script here:
# sudo nano /etc/rc.local