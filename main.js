'use strict'


import config from './config'
import server from './lib/server.js'

server.bind(config.port, () => {
    console.log(`Server bound on port ${config.port}`)
})
