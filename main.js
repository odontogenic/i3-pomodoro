'use strict'


import Pomodoro from './lib/pomodoro'
import Server from './lib/server'

let pomodoro = new Pomodoro(),
    server = new Server(pomodoro)

server.run()

function exitHandler(err, options) {
    if (err) console.log(err.stack)

    pomodoro.pause()
    pomodoro.writer.close()
    pomodoro.store.close()

    if (options.exit) {
        process.exit(err ? 1 : 0)
    }
}


// do something when app is closing
process.on('exit', exitHandler.bind(null, null, { cleanup: true }))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, null, { exit: true }))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null))
