'use strict'

import { exec } from 'child_process'
import player from 'play-sound'
import config from '../config'
import Store from './store'
import Writer from './writer'

class Pomodoro {

    constructor() {
        this.store = new Store()
        this.writer = new Writer()
        this.player = player({})

        this.init.call(this)
    }

    init() {
        this.store.getPeriods().then((periods) => {

            this.periods = periods
            this.sessions = this.generate.call(this) // create iterator
            this.write() // write initial state

        }).catch((err) => console.error(err))
    }

    get running() {
        return (this.session === undefined ||
                this.session._onTimeout === null) ?
            false : true
    }

    toggle() {
        (this.running) ? this.pause.call(this): this.resume.call(this)
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
        this.session = this.sessions.next().value
    }

    clear() {
        if (this.running) clearInterval(this.session)

        this.store.reset((err) => {
            delete this.remaining
            this.init.call(this)
        })
    }

    toString() {
        let output = '',
            blocks = ['◽', '◾'],
            full = this.periods[0].complete,
            empty = 4 - full

        for (let i = 0; i < empty; i++) {
            output += blocks[0]
        }

        for (let i = 0; i < full; i++) {
            output += blocks[1]
        }

        output += '  '
        output += (this.remaining && this.formatTime(this.remaining)) || '00:00'
        output += '\n\n'

        if (this.running) {
            if ((this.periods[0]._id % 2) === 0) {
                output += config.colors.break+'\n'
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
            let period = this.periods[0],
                startTime = Date.now(),
                interval = setInterval(() => {
                    let now = Date.now()

                    this.remaining = startTime + period.remaining - now

                    this.write()

                    if (now >= startTime + period.remaining) {
                        this.player.play(config.sounds.finish, function(err) {
                            if (err) console.error(err)

                            console.log(`pomodoro is complete`)
                        })

                        this.next()
                    }
                }, 1000)
            yield interval
        }
    }

    write() {
        this.writer.write(new Buffer(this.toString()))

        exec(`pkill -RTMIN+${config.signal} i3blocks`, (error, stdout, stderr) => {
            if (error) console.err(error)
        })
    }

    formatTime(msec) {
        let sec_num = parseInt((msec / 1000), 10),
            minutes = Math.floor(sec_num / 60),
            seconds = sec_num - (minutes * 60)

        if (minutes < 10) minutes = `0${minutes}`

        if (seconds < 10) seconds = `0${seconds}`

        return `${minutes}:${seconds}`
    }
}

export default Pomodoro
