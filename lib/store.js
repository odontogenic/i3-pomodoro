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

    setPeriod(position, period, callback) {
        this.client.lset("pomodoro:periods", 0, JSON.stringify(period), callback)
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

    getStatus(callback) {
        this.client.get('pomodoro:status', (err, status) => {
            if (status === null) {
                status = 0
                this.client.set('pomodoro:status', status)
            }

            callback(err, +status)
        })
    }

    setStatus(status) {
        this.client.set('pomodoro:status', status, redis.print)
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
