'use strict'

import Store from './store'
import Writer from './writer'
import config from '../config'


class Pomodoro {

    constructor() {

        this.store = new Store()

        this.writer = new Writer()

        this.store.getPeriods().then((periods) => {
            this.periods = periods

            this.sessions = this.generate.call(this) // create iterator

            // if (this.running) this.resume.call(this)

        }).catch((err) => console.error(err))

        this.blocks = ['◽', '◾']
    }

    get running() {
        if (this.session === undefined || this.session._onTimeout === null) {
            return false
        } else {
            return true
        }
    }

    toggle() {

        if (this.running) {
            this.pause.call(this)
        } else {
            this.resume.call(this)
        }
    }

    next() {

        if (this.running) clearInterval(this.session)

        this.store.reschedule((err) => {
            if (err) console.error(err)

            this.store.getPeriods().then((periods) => {
                this.periods = periods

                this.session = this.sessions.next().value
            })

        })

    }

    pause() {

        if (this.running) clearInterval(this.session)

        let period = this.periods[0]
        period.remaining = this.remaining || period.remaining


        this.store.setPeriod(0, period, (err) => {
            if (err) console.error(err)
        })

        this.write()
    }

    resume() {
        // this.status = 1
        this.session = this.sessions.next().value
    }

    toString() {
        let output = ''

        let full = this.periods[0].complete
        let empty = 4 - full

        for (let i = 0; i < empty; i++) {
            output += this.blocks[0]
        }

        for (let i = 0; i < full; i++) {
            output += this.blocks[1]
        }

        output += '  '

        output += (this.remaining && this.formatTime(this.remaining)) || '00:00'
        output += '\n\n'

        if ( this.running ) {
            if (( this.periods[0]._id % 2 ) === 0 ) {
                output += config.colors.break + '\n'
            } else {
                output += config.colors.session + '\n'
            }
        } else {
            output += config.colors.inactive + '\n'
        }

        return output
    }

    * generate() {
        while (true) {
            let period = this.periods[0]
            let startTime = Date.now(),
                interval = setInterval(() => {
                    let now = Date.now()

                    this.remaining = startTime + period.remaining - now

                    this.write()

                    if (now >= startTime + period.remaining) {
                        console.log(`pomodoro is complete`)

                        this.next()
                    }
                }, 1000)

            yield interval
        }
    }

    write() {
        this.writer.write(new Buffer(this.toString()))
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
