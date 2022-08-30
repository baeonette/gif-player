#!/bin/bash
# Runs GIF folder
DISPLAY=:0.0 XAUTHORITY=/home/baeonette/.Xauthority /usr/bin/feh --quiet --preload --full-screen --reload 60 -Y --slideshow-delay 0.1 /home/baeonette/gif-player/media/playing/*.pkg/content/

# Config boot script here:
# sudo nano /etc/rc.local

# To close the player, run the following:
# sudo pkill feh
# kill-player also works [it runs the same thing]
