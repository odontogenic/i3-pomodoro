# i3-pomodoro #

This utility built in Node.js allows one to manage pomodoro sessions from the
i3 bar (via i3blocks).  The block is clickable and can control session toggling
etc.  In addition, key bindings can be assigned to the cli. Redis allows for
persistence of sessions across reboots.  Refer to instructions and screenshots
below.

see [Wikipedia] (https://en.wikipedia.org/wiki/Pomodoro_Technique)

> The Pomodoro Technique is a time management method developed
> by Francesco Cirillo in the late 1980s. The technique uses
> a timer to break down work into intervals traditionally 25
> minutes in length, separated by short breaks. These intervals
> are known as "pomodoros", the plural in English of the Italian
> word pomodoro meaning "tomato". The method is based on the
> idea that frequent breaks can improve mental agility.


## Installation ##

`npm install`

*Note: Redis expected to be running on localhost:6379*

__i3blocks config__

    [pomodoro]
    command=~/projects/i3-pomodoro/block.sh
    signal=2
    interval=once

*Note: signal must match that provided in config.js*


## Usage ##

__Run__

`npm start`

__Control pomodoro via button click. Configure in block.sh__

* BTN 1 (left):   Toggle session
* BTN 2 (middle): Reset sessions
* BTN 3 (right):  Next session

__Control pomodoro via cli__

`pomodoro-cli --next`

`pomodoro-cli --toggle`

`pomodoro-cli --pause`

`pomodoro-cli --resume`

`pomodoro-cli --clear`


## Screenshots ##

![inactive](http://i.imgur.com/VZzsXeW.png)
![session](http://i.imgur.com/mJC06qe.png)
![break](http://i.imgur.com/I5wDBZ1.png)
