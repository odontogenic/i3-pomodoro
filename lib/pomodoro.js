'use strict'

import Store from './store'

/**
 * class Pomodoro
 *
 * @param options obj
 *  status (0,1)
 *  current (index)
 *  session (msec)
 *  shortBreak (msec)
 *  longBreak (msec)
 *
 */

class Pomodoro {
    constructor(options) {
        this.store = new Store()

        this.store.getData().then((options) => {

            this.configure(options)

            this.sessions = this.generate.call(this) // create iterator

            if (+options.status === 1) {
                this.next.call(this)
            }

        }).catch((err) => console.error(err))
        // .catch((err) => exitHandler(err))

    }

    configure(options) {
        this.periods = [
            { // study
                complete: 0,
                remaining: +options.session
            },
            { // short break
                complete: 1,
                remaining: +options.shortBreak
            },
            { // study
                complete: 1,
                remaining: +options.session
            },
            { // short break
                complete: 2,
                remaining: +options.shortBreak
            },
            { // study
                complete: 2,
                remaining: +options.session
            },
            { // short break
                complete: 3,
                remaining: +options.shortBreak
            },
            { // study
                complete: 3,
                remaining: +options.session
            },
            { // long break
                complete: 4,
                remaining: +options.longBreak
            }
        ]

        if (options.current > 0) {
            let period = this.periods.slice(+options.current),
                end = this.periods.splice(0, +options.current)

            this.periods = period.concat(end)
        }
    }

    next() {

        if (this.session) clearInterval(this.session)

        this.session = this.sessions.next().value

    }

    * generate() {
        while (true) {
            let period = this.periods.shift(),
                startTime = Date.now(),
                interval = setInterval(() => {
                    let now = Date.now()

                    console.log(this.formatTime(startTime + period.remaining - now))

                    if (now >= startTime + period.remaining) {
                        console.log(`pomodoro is complete`)

                        this.next()
                    }
                }, 1000)

            this.periods.push(period)
            yield interval
        }
    }

    formatTime(msec) {
        let sec_num = parseInt((msec / 1000), 10)
        let minutes = Math.floor(sec_num / 60)
        let seconds = sec_num - (minutes * 60)

        if (minutes < 10) {
            minutes = `0${minutes}`
        }
        if (seconds < 10) {
            seconds = `0${seconds}`
        }

        let time = `${minutes}:${seconds}`
        return time
    }
}

export default Pomodoro
