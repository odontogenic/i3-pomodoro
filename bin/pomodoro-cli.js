#!/usr/bin/env node

/**
 * pomodoro.js
 *
 * USAGE
 *
 * pomodoro <>
 *   --pause
 *   --resume
 *   --toggle
 *   --clear
 *   --next
 */

'use strict'

const program = require('commander')
const dgram = require('dgram')
const config = require('../config')
const ActionTypes = require('../lib/actions')

program
    .version('0.0.1')
    .option('-p, --pause', 'Pause session')
    .option('-r, --resume', 'Resume session')
    .option('-t, --toggle', 'Toggle session')
    .option('-c, --clear', 'Clear sessions')
    .option('-n, --next', 'Next session')
    .parse(process.argv)

if (program.toggle) {
    send(ActionTypes.TOGGLE)
} else if (program.pause) {
    send(ActionTypes.PAUSE)
} else if (program.resume) {
    send(ActionTypes.RESUME)
} else if (program.next) {
    send(ActionTypes.NEXT)
} else if (program.clear) {
    send(ActionTypes.CLEAR)
} else {
    program.outputHelp()
    process.exit(1)
}

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
