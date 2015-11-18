'use strict'

/**
 * server.js
 *
 */

import dgram from 'dgram'
import ActionTypes from './actions'
import config from '../config'

class Server {

    constructor(pomodoro) {
        this.socket = dgram.createSocket('udp4')
        this.socket.on("message", function(msg) {
            switch (ActionTypes[msg]) {
                case ActionTypes.PAUSE:
                    pomodoro.pause()
                    break

                case ActionTypes.RESUME:
                    pomodoro.resume()
                    break

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
    }

    run() {
        this.socket.bind(config.port, () => {
            console.log(`Server bound on port ${config.port}`)
        })

    }

}

export default Server
