'use strict'

/**
 * server.js
 *
 */

import dgram from 'dgram'
import ActionTypes from './actions'
import Pomodoro from './pomodoro'


let server = dgram.createSocket("udp4"),
    pomodoro = new Pomodoro()


server
    .on("message", function(msg) {
        switch (ActionTypes[msg]) {
            case ActionTypes.NEXT:
                pomodoro.next()
                break

            case ActionTypes.TOGGLE:
                pomodoro.toggle()
                break

            case ActionTypes.RESET:
                pomodoro.reset()
                break

            case ActionTypes.CLEAR:
                pomodoro.clear()
                break

            default:
                break
        }
    })

export default server
