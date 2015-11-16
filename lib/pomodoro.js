/**
 * @class Pomodoro
 *
 */
class Pomodoro {
    constructor(config, current, remaining, status) {

        this.periods = [
            config[0], // study
            config[1], // short break

            config[0], // study
            config[1], // short break

            config[0], // study
            config[1], // short break

            config[0], // study
            config[2] // long break
        ]

        this.remaining = remaining || config[0]

        if (current > 0) {
            let slice = this.periods.slice(0, current)
        }

        this.sessions = this.generate.call(this) // create iterator

        if (status === 1) {
            this.next()
        }
    }

    next() {

        if (this.session) clearInterval(this.session)

        this.session = this.sessions.next().value

    }

    * generate() {
        while (true) {
            let period = this.periods.shift(),
                length = Math.min(period, this.remaining),
                startTime = Date.now(),
                interval = setInterval(() => {
                    let now = Date.now()

                    console.log(this.formatTime(startTime + length - now))

                    if (now >= startTime + length) {
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
