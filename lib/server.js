/**
 * server.js
 *
 */
import dgram from 'dgram'
import config from '../config'
import ActionTypes from '../lib/actions'
import redis from 'redis'


let client = redis.createClient()

let session = null

let iterator = null

client.on("error", function(err) {
    if (err.code === 'ECONNREFUSED') {
        exit(err)
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
                data = {
                    "status": "1",
                    "current": "0", // NOTE: key and value will be coerced to strings
                    "remaining": "35000",
                    "config": ["1500000", "300000", "900000"]
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

        iterator = generateSessions(config, current, remaining)

        if (status === 1) {
            session = iterator.next().value
        }

    })
    .catch((err) => exit(err))



function* generateSessions(config, current, remaining) {

    let periods = [
        config[0],  // study
        config[1],  // short break

        config[0],  // study
        config[1],  // short break

        config[0],  // study
        config[1],  // short break

        config[0],  // study
        config[2]   // long break
    ]

    while (true) {
        let period = periods.shift()

        let length = Math.min(period, remaining)

        let startTime = Date.now()

        let interval = setInterval(() => {
            let now = Date.now()

            console.log(formatTime(startTime + length - now))

            if (now >= startTime + length) {
                console.log(`pomodoro is complete`)

                clearInterval(interval)

                iterator.next()

            }
        }, 1000)

        periods.push(period)

        yield interval
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

function formatTime(msec) {
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

let server = dgram.createSocket("udp4")
server
    .on("message", function(msg) {
        switch (ActionTypes[msg]) {
            case ActionTypes.NEXT:
                clearInterval(session)
                session = iterator.next().value
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

export default server
