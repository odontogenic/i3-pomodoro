/**
 * server.js
 *
 */

import dgram from 'dgram'
import config from '../config'
import ActionTypes from '../lib/actions'
import redis from 'redis'


let server = dgram.createSocket("udp4"),
    client = redis.createClient(),
    pomodoro


client.on("error", function(err) {
    if (err.code === 'ECONNREFUSED') {
        exit(err)
    }
})

server
    .on("message", function(msg) {
        switch (ActionTypes[msg]) {
            case ActionTypes.NEXT:
                pomodoro.next()
                break

            case ActionTypes.TOGGLE:
                break

            case ActionTypes.RESET:

                break

            case ActionTypes.CLEAR:

                break

            default:
        }
    })

function exit(err) {
    if (err) console.error(err)
    process.exit(err ? 1 : 0)
}

function initialize() {
    var promise = new Promise((resolve, reject) => {

        client.hgetall("pomodoro", function(err, data) {
            if (err) {
                return reject(err)
            }

            if (data === null) {
                data = { // NOTE: key and value will be coerced to strings
                    status: 1,
                    current: 0,
                    remaining: config.periods.session,
                    config: [config.periods.session, config.periods.shortBreak, config.periods.longBreak]
                }

                client.hmset("pomodoro", data, redis.print)

            }

            resolve(data)
        })
    })

    return promise
}


initialize()
    .then((data) => {
        let config = data.config.split(',').map(Number)
        let current = +data.current
        let status = +data.status
        let remaining = +data.remaining

        pomodoro = new Pomodoro(config, current, remaining, status)

    })
    .catch((err) => exit(err))


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
            minutes = "0" + minutes
        }
        if (seconds < 10) {
            seconds = "0" + seconds
        }
        let time = minutes + ':' + seconds
        return time
    }
}


// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });


export default server
