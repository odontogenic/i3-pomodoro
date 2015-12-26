'use strict'

const config = require('../config')

class Store {

    constructor(client) {
        this.client = client

        // @TODO  handle errors here
        // this.client.on('error', function(err) {
        //     if (err.code === 'ECONNREFUSED') {
        //
        //     }
        // })
    }

    reschedule(callback) {
        this.client.lpop('pomodoro:periods', (err, data) => {
            let obj = JSON.parse(data)

            for (let i = 0, len = Store.PERIODS.length; i < len; i++) {
                if (Store.PERIODS[i]._id === obj._id) {
                    let period = Object.assign({}, Store.PERIODS[i])

                    this.client.rpush('pomodoro:periods', JSON.stringify(period))

                    return callback(err)
                    // break
                }
            }
        })

    }

    setPeriod(position, period, callback) {
        this.client.lset('pomodoro:periods', position, JSON.stringify(period), callback)
    }

    getPeriods() {
        let promise = new Promise((resolve, reject) => {
            this.client.lrange('pomodoro:periods', 0, -1, (err, periods) => {
                if (err) return reject(err)

                if (!periods.length) {
                    // for (let period of Store.PERIODS) {
                    this.client.rpush('pomodoro:periods', Store.PERIODS.map(JSON.stringify))
                    this.client.lrange('pomodoro:periods', 0, -1, (err, periods) => {
                        return resolve(periods.map(JSON.parse))
                    })

                } else {
                    // return resolve(periods)
                    process.nextTick(() => {
                        return resolve(periods.map(JSON.parse))
                    })
                }
            })
        })
        return promise
    }

    clearPeriods(callback) {
        this.client.del('pomodoro:periods', callback)
    }

    close() {
        console.log(`Closing redis client ---`)
        this.client.quit()
    }

}

Store.PERIODS = [
    { _id: 1, remaining: config.periods.session },
    { _id: 2, remaining: config.periods.shortBreak },
    { _id: 3, remaining: config.periods.session },
    { _id: 4, remaining: config.periods.shortBreak },
    { _id: 5, remaining: config.periods.session },
    { _id: 6, remaining: config.periods.shortBreak },
    { _id: 7, remaining: config.periods.session },
    { _id: 8, remaining: config.periods.longBreak }
]

module.exports = Store
