'use strict'


import config from './config'
import server from './lib/server.js'

server.bind(config.port, () => {
    console.log(`Server bound on port ${config.port}`)
})

function exitHandler(err, options) {
    if (err) console.log(err.stack)

    if (options.cleanup) console.log(`options.cleanup`)

    if (options.exit) {
        process.exit(err ? 1 : 0)
    }
}


// do something when app is closing
process.on('exit', exitHandler.bind(null, null, {cleanup:true}))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, null, {exit:true}))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null))
