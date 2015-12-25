'use strict'

let config = ({
    hostname: 'localhost', // udp hostname
    port: 41234, // udp port
    signal: 2, // kill signal
    output: `${process.env.HOME}/tmp/pomodoro`,
    periods: { // length in ms
        session: 1000 * 60 * 25,
        shortBreak: 1000 * 60 * 5,
        longBreak: 1000 * 60 * 15
    },
    colors: {
        session: '#DBDBDB',
        break: '#CAE682',
        inactive: '#666666'
    },
    sounds: {
        finish: `${__dirname}/sounds/glass.aiff`,
        start: `${__dirname}/sounds/ping.aiff`
    }
})

module.exports = config
