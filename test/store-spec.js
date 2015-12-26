'use strict'

let expect = require('chai').expect
let sinon = require('sinon')
let redis = require('redis')
let fakeredis = require('fakeredis')
let Store = require('../lib/store')

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

    it('getPeriods should create periods', function(done) {
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

    it('next should advance ', function() {

    })

})
