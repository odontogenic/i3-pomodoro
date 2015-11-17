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


            this.store.getStatus((err, status) => {
                if (status === 1) this.start()
            })
        }).catch((err) => console.error(err))


    }

    toggle() {

        this.store.setStatus(increment, (err, status) => {
            if (err) return console.error(err)

            if (this.status = status) {
                this.next()
            }
        })
    }

    start() {
        this.store.setStatus(1, (err) => {
            this.session = this.sessions.next().value
        })
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

            // this.periods.push(period)
            // this.store.savePeriods(this.periods)

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
