#!/usr/bin/env babel-node

/**
 * pomodoro.js
 *
 * USAGE
 *
 * pomodoro <>
 *   --start
 *   --toggle
 *   --pause
 *   --start
 *   --stop
 *   --reset
 *
 */

'use strict'

import program from 'commander'
import dgram from 'dgram'
import config from '../config'
import ActionTypes from '../lib/actions'


program
    .version('0.0.1')
    .option('-s, --start', 'Start session')
    .option('-t, --toggle', 'Toggle session')
    .option('-R, --reset', 'Reset current session')
    .option('-p, --pause', 'Pause session')
    .option('-r, --resume', 'Resume session')
    .option('-n, --next', 'Skip to next session')
    .option('-c, --clear', 'Clear sessions')
    // .option('-s, --set <config>', 'Set config', list)
    .parse(process.argv)

if (program.toggle) {
    send(ActionTypes.TOGGLE)
} else if (program.start) {
    send(ActionTypes.START)
} else if (program.pause) {
    send(ActionTypes.PAUSE)
} else if (program.resume) {
    send(ActionTypes.RESUME)
} else if (program.reset) {
    send(ActionTypes.RESET)
} else if (program.next) {
    send(ActionTypes.NEXT)
} else if (program.clear) {
    send(ActionTypes.CLEAR)
} else {
    program.outputHelp()
    process.exit(1)
}

// function list(val) {
//     return val.split(',')
// }
//
// function set(config) {
//
//     let time = {
//         session: 1000 * 60 * 25,
//         shortBreak: 1000 * 60 * 5,
//         longBreak: 1000 * 60 * 15
//     }
//
//     send(ActionTypes.RESET)
// }

function send(action) {
    let client = dgram.createSocket("udp4")

    let message = new Buffer(action)

    client.send(message, 0, message.length, config.port, config.hostname, (err) => {
        if (err) {
            console.error(err)
        }
        client.close()
    })
}
