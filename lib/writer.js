'use strict'

import fs from 'fs'
import { Writable } from 'stream'
import { exec } from 'child_process'
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

        // this.file = fs.createWriteStream(config.output)


        // check if isTTY
    }

    _write(chunk, encoding, callback) {
        // this.file.write(chunk.toString())

        fs.write(this.fd, chunk, 0, chunk.length, 0, (err, bytes) => {
            exec(`pkill -RTMIN+${config.signal} i3blocks`, (error, stdout, stderr) => {
                if (error) console.err(error)
                callback()
            })
        })

        process.stdout.write(chunk.toString() + '\n')


    }

    close() {
        console.log(`Closing write file (${this.fd}) ---`)
        fs.close(this.fd)
    }
}

export default Writer
