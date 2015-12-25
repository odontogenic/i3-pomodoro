'use strict'

import assert from 'assert'
import sinon from 'sinon'
import redis from 'redis'
import fakeredis from 'fakeredis'
import Store from '../lib/store'

var client,
    store

describe('Redis store', () => {

    before(() => {
        sinon.stub(redis, 'createClient', fakeredis.createClient)

        client = redis.createClient()
    })

    after(() => {
        redis.createClient.restore()
    })

    afterEach((done) => {
        client.flushdb((err) => {
            done(err)
        })
    })

    it('should pass', function() {

    })
})
