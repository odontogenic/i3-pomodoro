#!/bin/bash

CLI="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/bin/pomodoro-cli"

case $BLOCK_BUTTON in
    1) babel-node $CLI -t & ;;
    2) babel-node $CLI -c & ;;
    3) babel-node $CLI -n & ;;
esac

FILE=$HOME/tmp/pomodoro
if [ -f $FILE ];
then
    cat $FILE
else
    echo "◽◽◽◽ 00:00"
    echo ""
    echo "#666666"
fi
