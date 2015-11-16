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

    getData() {
        let promise = new Promise((resolve, reject) => {

            this.client.hgetall("pomodoro", (err, data) => {
                if (err) return reject(err)

                if (data === null) {
                    data = { // NOTE: key and value will be coerced to strings
                        status: 1,
                        current: 0,
                        session: config.periods.session,
                        shortBreak: config.periods.shortBreak,
                        longBreak: config.periods.longBreak

                    }
                    this.client.hmset("pomodoro", data, redis.print)

                }

                resolve(data)
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

export default Store
