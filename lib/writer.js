'use strict'

import { execFile } from 'child_process'
import fs from 'fs'
import { Writable } from 'stream'
import config from '../config'

class Writer extends Writable {

    constructor(props) {
        super(props)

        // open for writing. create if doesn't exist
        // truncate file to zero if it does exit
        fs.open(config.output, 'w', (err, fd) => {
            if (err) return console.error(err)
            this.fd = fd
        })

        // check if isTTY
    }

    _write(chunk, encoding, callback) {

        fs.write(this.fd, chunk, 0, chunk.length, 0, (err, bytes) => {
            process.stdout.write(chunk.toString() + '\n')

            execFile('pkill', [`-RTMIN+${config.signal}`, 'i3blocks'])

            callback()
        })

    }

    close() {
        console.log(`Closing write file (${this.fd}) ---`)
        fs.close(this.fd)
    }
}

export default Writer
