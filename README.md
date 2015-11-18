# i3-pomodoro #

Manage pomodoro sessions from i3 bar

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

*Note: redis expected to be running on localhost:6379*

__i3block config__

    [pomodoro]
    command=~/projects/i3-pomodoro/block.sh
    signal=2
    interval=once

*Note: signal must match that given in config.js*


## Usage ##

__Control pomodoro via button click. Configure in block.sh__

* BTN 1 (left):   Toggle session
* BTN 2 (middle): Reset sessions
* BTN 3 (right):  Next session

** Control pomodoro via cli **

`pomodoro-cli --next`

`pomodoro-cli --toggle`

`pomodoro-cli --pause`

`pomodoro-cli --resume`

`pomodoro-cli --clear`


## Screenshots ##

![inactive](http://i.imgur.com/VZzsXeW.png)
![session](http://i.imgur.com/mJC06qe.png)
![break](http://i.imgur.com/I5wDBZ1.png)
