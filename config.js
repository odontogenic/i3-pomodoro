'use strict'

export default ({
    hostname: 'localhost',
    port: 41234,
    periods: { // note: these values are only used once! use `pomodoro set <....>'
        session: 1000 * 60 * 25,
        shortBreak: 1000 * 60 * 5,
        longBreak: 1000 * 60 * 15
    }
})
