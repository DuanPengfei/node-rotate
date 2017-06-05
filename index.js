'use strict';

const fs = require('fs');
const Writable = require('stream').Writable;

const debug = require('debug')('node-rotate');

class NodeRotate extends Writable {
    constructor(options) {
        const superOptions = {
            highWaterMark: options.highWaterMark
        };
        const selfOptions = {
            filename: options.filename,
            retryCount: options.retryCount || 3,
            reconnectCount: options.reconnectCount || 3,
            overwrite: options.overwrite || []
        };

        super(superOptions);

        this.filename = selfOptions.filename;
        this.retryCount = selfOptions.retryCount;
        this.reconnectCount = selfOptions.reconnectCount;
        this.overwrite = selfOptions.overwrite;
        this.errCount = 0;
        this.writer = this._open();

        if (this.overwrite instanceof Array && this.overwrite.length > 0) {
            for (const item of this.overwrite) {
                if (item === 'stdout') {
                    process.stdout.write = this.write.bind(this);
                } else if (item === 'stderr') {
                    process.stderr.write = this.write.bind(this);
                }
            }
        }
    }

    _write(chunk, encoding, callback) {
        this._rewrite(this.retryCount, chunk, encoding, function (err) {
            return callback(err);
        });
    }

    /**
     * rewrite data to writer stream
     * @param {Number} retryCount retry count
     * @param {String|Buffer} chunk data write to stream
     * @param {String} encoding encoding of chunk
     * @param {Function} callback callback
     */
    _rewrite(retryCount, chunk, encoding, callback) {
        debug(`retryCount: ${retryCount}`);

        const _this = this;
        _this.writer.write(chunk, encoding, function (err) {
            if (err) {
                debug(`fs write stream error: ${err.message}`);

                retryCount -= 1;
                if (retryCount > 0) {
                    _this._increaseErrCount();
                    _this._rewrite(retryCount, chunk, encoding, callback);
                } else {
                    return callback(err);
                }
            } else {
                return callback();
            }
        });
    }

    /**
     * increase error count of write data to writer stream
     */
    _increaseErrCount() {
        this.errCount += 1;
        if (this.errCount >= this.reconnectCount) {
            this.errCount = 0;
            this.writer.end();
            this.writer = this._open();
        }
    }

    /**
     * return fs.createWriteStream
     * @return {Stream} fs.createWriteStream
     */
    _open() {
        if (!this.filename) {
            throw new Error('Lack of filename.');
        }
        return fs.createWriteStream(this.filename, { flags: 'a' });
    }
}

module.exports = NodeRotate;
