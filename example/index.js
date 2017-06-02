'use strict';

const NodeRotate = require('../index');

const _stdOut = new NodeRotate({
    filename: './out.log'
});
const _stdErr = new NodeRotate({
    filename: './err.log'
});

process.stdout.write = _stdOut.write.bind(_stdOut);
process.stderr.write = _stdErr.write.bind(_stdErr);

console.log('out 1');
console.error('err 1');
console.log('out 2');
console.error('err 2');
