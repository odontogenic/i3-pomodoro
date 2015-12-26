'use strict'

const expect = require('chai').expect
const sinon = require('sinon')
const redis = require('redis')
const fakeredis = require('fakeredis')
const config = require('../config')
const Store = require('../lib/store')

let client, store

describe('Store', () => {

    before(() => {
        sinon.stub(redis, 'createClient', fakeredis.createClient)

        client = redis.createClient()
        store = new Store(client)
    })

    after(() => {
        redis.createClient.restore()
    })

    beforeEach((done) => {
        client.flushdb((err) => {
            done()
        })
    })

    it('getPeriods should get or create periods', function(done) {
        store.getPeriods().then((periods) => {
            expect(periods.length).to.equal(8)
            done()
        })
    })

    it('reschedule should move first session to the end', function(done) {
        store.getPeriods().then((periods) => {
            store.reschedule((err) => {
                store.getPeriods().then((periods) => {
                    expect(periods[0]._id).to.equal(2)
                    expect(periods[7]._id).to.equal(1)

                    // make sure time
                    done()
                })
            })
        })
    })

    it('setPeriod should set a period at a specified position', function(done) {
        let period = {
            _id: 10,
            complete: 0,
            remaining: config.periods.session
        }

        store.getPeriods().then(() => {
            store.setPeriod(0, period, (err) => {
                store.getPeriods().then((periods) => {
                    expect(periods.length).to.equal(8)
                    expect(periods.shift()).to.eql(period) // deep.equal
                    done()
                })
            })

        })
    })

})
