'use strict'

const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const redis = require('redis')
const fakeredis = require('fakeredis')
const Pomodoro = require('../lib/pomodoro')
const Store = require('../lib/store')
const config = require('../config')
const periods = require('../lib/store').PERIODS
const player = require('play-sound')

let client, clock, pomodoro, store, writer

chai.should()
chai.use(sinonChai)

describe('Pomodoro', function() {
    before(() => {
        sinon.stub(redis, 'createClient', fakeredis.createClient)
    })

    after(() => {
        redis.createClient.restore()
    })

    beforeEach((done) => {
        client = redis.createClient()

        store = new Store(client)
        sinon.spy(store, 'getPeriods')

        writer = {
            write: sinon.spy()
        }

        client.flushdb()

        pomodoro = new Pomodoro(store, writer, player({}), done)
    })

    it('should initialize correctly', function() {
        store.getPeriods.should.have.been.calledOnce

        pomodoro.periods.length.should.equal(8)

        writer.write.should.have.been.calledOnce

        // ensure generator was initialized
        pomodoro.sessions.next.should.be.ok
    })

    it('should report remaining time correctly', function() {
        let tick = 10000

        clock = sinon.useFakeTimers()

        pomodoro.resume()

        clock.tick(tick)

        pomodoro.remaining.should.equal(config.periods.session - tick)
        clock.restore()
    })

    it('should enter next session when current completes', function() {
        let tick = config.periods.session - 1

        sinon.spy(pomodoro, 'next')
        sinon.stub(pomodoro.player, 'play')
        clock = sinon.useFakeTimers()

        pomodoro.resume()
        clock.tick(tick)

        pomodoro.next.should.not.have.been.called

        clock.tick(1)

        pomodoro.next.should.have.been.calledOnce

        pomodoro.player.play.should.have.been.calledOnce

        clock.restore()
    })

    it('should toggle the session state', function() {
        pomodoro.resume()

        pomodoro.running.should.be.true

        pomodoro.toggle()

        pomodoro.running.should.be.false
    })

    it('should clear a session', function() {
        pomodoro.resume()

        pomodoro.clear()

        pomodoro.running.should.be.false
    })

    it('should format remaining session time as MM:SS', function() {
        pomodoro.formatTime(90000).should.equal('01:30')
        pomodoro.formatTime(config.periods.session).should.equal('25:00')
        pomodoro.formatTime(config.periods.shortBreak).should.equal('05:00')
        pomodoro.formatTime(config.periods.longBreak).should.equal('15:00')
    })

})
