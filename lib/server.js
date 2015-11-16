/**
 * server.js
 *
 */

import dgram from 'dgram'
import redis from 'redis'
import config from '../config'
import ActionTypes from '../lib/actions'
import Pomodoro from './pomodoro'


let server = dgram.createSocket("udp4"),
    client = redis.createClient(),
    pomodoro


client.on("error", function(err) {
    if (err.code === 'ECONNREFUSED') {
        exitHandler(err)
    }
})

server
    .on("message", function(msg) {
        switch (ActionTypes[msg]) {
            case ActionTypes.NEXT:
                pomodoro.next()
                break

            case ActionTypes.TOGGLE:
                pomodoro.toggle()
                break

            case ActionTypes.RESET:
                pomodoro.reset()
                break

            case ActionTypes.CLEAR:
                pomodoro.clear()
                break

            default:
                break
        }
    })

function exitHandler(err, options) {
    if (err) console.log(err.stack)

    if (options.cleanup) console.log(`options.cleanup`)

    if (options.exit) {
        process.exit(err ? 1 : 0)
    }
}


// do something when app is closing
process.on('exit', exitHandler.bind(null, null, {cleanup:true}))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, null, {exit:true}))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null))

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
    .catch((err) => exitHandler(err))


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
