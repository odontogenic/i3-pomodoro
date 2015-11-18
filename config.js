'use strict'

export default ({
    hostname: 'localhost',
    port: 41234,
    signal: 2, // kill signal
    output: `${process.env.HOME}/tmp/pomodoro`,
    periods: {
        session: 1000 * 60 * 25,
        shortBreak: 1000 * 60 * 5,
        longBreak: 1000 * 60 * 15
    },
    colors: {
        session: '#FFFFFF',
        break: '#CAE682',
        inactive: '#666666'
    }
})
