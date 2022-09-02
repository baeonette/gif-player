#!/bin/bash
# Runs GIF folder

DISPLAY=:0.0 \
chromium-browser \
http://localhost:3000/api/playing/$1

# Config boot script here:
# sudo nano /etc/rc.local