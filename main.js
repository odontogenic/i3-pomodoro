'use strict'

const Pomodoro = require('./lib/pomodoro')
const Server = require('./lib/server')
const Store = require('./lib/store')
const Writer = require('./lib/writer')
const player = require('play-sound')
const redis = require('redis')

let writer = new Writer(),
    store = new Store(redis.createClient()),
    pomodoro = new Pomodoro(store, writer, player({})),
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
