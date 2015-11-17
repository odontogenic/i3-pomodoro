'use strict'

import redis from 'redis'
import config from '../config'

class Store {

    constructor() {
        this.client = redis.createClient()

        this.client.on("error", function(err) {
            if (err.code === 'ECONNREFUSED') {
                // exitHandler(err)
            }
        })
    }

    setStatus(increment, callback) {
        this.client.incr('pomodoro:status', increment, (err, data) => {
            callback(err, data)
        })
    }

    reschedule(callback) {
        this.client.lpop('pomodoro:periods', (err, data) => {
            let obj = JSON.parse(data)

            for (let i = 0, len = Store.PERIODS.length; i < len; i++) {
                if (Store.PERIODS[i]._id === obj._id) {
                    let period = Object.assign({}, Store.PERIODS[i])

                    this.client.rpush('pomodoro:periods', JSON.stringify(period), redis.print)

                    callback(err)
                    break
                }
            }
        })

    }

    getPeriods() {
        let promise = new Promise((resolve, reject) => {
            this.client.lrange("pomodoro:periods", 0, -1, (err, periods) => {
                if (err) return reject(err)

                if (!periods.length) {
                    // for (let period of Store.PERIODS) {
                    this.client.rpush("pomodoro:periods", Store.PERIODS.map(JSON.stringify), redis.print)
                    this.client.lrange("pomodoro:periods", 0, -1, (err, periods) => {
                        return resolve(periods.map(JSON.parse))
                    })

                } else {
                    // return resolve(periods)
                    return resolve(periods.map(JSON.parse))
                }
            })
        })
        return promise
    }

    getStatus() {
        if (this.status) {
            process.nextTick(() => {
                return this.status
            })
        }

        this.client.hget('pomodoro', 'status', (err, status) => {
            this.status = status
            return this.status
        })
    }


}

Store.PERIODS = [{ // study
    _id: 1,
    complete: 0,
    remaining: config.periods.session,
    length: config.periods.session
}, { // short break
    _id: 2,
    complete: 1,
    remaining: config.periods.shortBreak,
    length: config.periods.shortBreak
}, { // study
    _id: 3,
    complete: 1,
    remaining: config.periods.session,
    length: config.periods.session
}, { // short break
    _id: 4,
    complete: 2,
    remaining: config.periods.shortBreak,
    length: config.periods.shortBreak
}, { // study
    _id: 5,
    complete: 2,
    remaining: config.periods.session,
    length: config.periods.session
}, { // short break
    _id: 6,
    complete: 3,
    remaining: config.periods.shortBreak,
    length: config.periods.shortBreak
}, { // study
    _id: 7,
    complete: 3,
    remaining: config.periods.session,
    length: config.periods.session
}, { // long break
    _id: 8,
    complete: 4,
    remaining: config.periods.longBreak,
    length: config.periods.longBreak
}]

export default Store
