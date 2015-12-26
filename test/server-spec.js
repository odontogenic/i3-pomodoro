'use strict'

const path = require('path')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const Server = require('../lib/server')
const fork = require('child_process').fork

let pomodoro = {
    toggle: sinon.stub(),
    pause: sinon.stub(),
    resume: sinon.stub(),
    next: sinon.stub(),
    clear: sinon.stub()
}

let server = new Server(pomodoro)

chai.should()
chai.use(sinonChai)

describe('Server', function() {
    before(() => {
        server.run()
    })

    after(() => {
        server.close()
    })

    it('should respond to toggle', function(done) {
        let command = fork(path.resolve(__dirname, '../bin/pomodoro-cli.js'), ['--toggle'])

        command.on('exit', () => {
            pomodoro.toggle.should.have.been.calledOnce
            done()
        })
    })

    it('should respond to pause', function(done) {
        let command = fork(path.resolve(__dirname, '../bin/pomodoro-cli.js'), ['--pause'])

        command.on('exit', () => {
            pomodoro.pause.should.have.been.calledOnce
            done()
        })
    })

    it('should respond to resume', function(done) {
        let command = fork(path.resolve(__dirname, '../bin/pomodoro-cli.js'), ['--resume'])

        command.on('exit', () => {
            pomodoro.resume.should.have.been.calledOnce
            done()
        })
    })

    it('should respond to next', function(done) {
        let command = fork(path.resolve(__dirname, '../bin/pomodoro-cli.js'), ['--next'])

        command.on('exit', () => {
            pomodoro.next.should.have.been.calledOnce
            done()
        })
    })

    it('should respond to clear', function(done) {
        let command = fork(path.resolve(__dirname, '../bin/pomodoro-cli.js'), ['--clear'])

        command.on('exit', () => {
            pomodoro.clear.should.have.been.calledOnce
            done()
        })
    })

})
