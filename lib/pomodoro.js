'use strict'

import Store from './store'

/**
 * class Pomodoro
 *
 * @param options obj
 *  status (0,1)
 *  session (msec)
 *  shortBreak (msec)
 *  longBreak (msec)
 *
 */

class Pomodoro {
    constructor(options) {
        this.store = new Store()

        this.store.getPeriods().then((periods) => {
            this.periods = periods

            this.sessions = this.generate.call(this) // create iterator

            if (this.status === 1) this.start()

        }).catch((err) => console.error(err))


    }

    get status() {
        if (this._status === undefined) {
            this.store.getStatus((err, status) => {
                return this._status = status
            })
        }

        return this._status
    }

    set status(status) {
        this.store.setStatus(this._status = status)
    }

    toggle() {
        this.status = (this.status === 1) ? 0 : 1

        if (this.status === 1) this.start()
    }

    start() {
        this.session = this.sessions.next().value
    }

    next() {

        if (this.session) clearInterval(this.session)

        this.store.reschedule((err) => {
            if (err) console.error(err)

            this.store.getPeriods().then((periods) => {
                this.periods = periods

                this.session = this.sessions.next().value
            })

        })

    }

    pause() {

        if (this.session) clearInterval(this.session)

        let period = this.periods[0]
        period.remaining = this.remaining

        this.status = 0

        this.store.setPeriod(0, period, (err) => {
            if (err) console.error(err)
        })
    }

    resume() {
        this.status = 1

        this.session = this.sessions.next().value
    }

    * generate() {
        while (true) {
            let period = this.periods[0]
            let startTime = Date.now(),
                interval = setInterval(() => {
                    let now = Date.now()

                    this.remaining = startTime + period.remaining - now

                    console.log(this.formatTime(this.remaining))

                    if (now >= startTime + period.remaining) {
                        console.log(`pomodoro is complete`)

                        this.next()
                    }
                }, 1000)

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
