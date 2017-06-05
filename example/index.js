'use strict';

const NodeRotate = require('../index');

const _stdOut = new NodeRotate({
    filename: './out.log',
    overwrite: [ 'stdout' ]
});
const _stdErr = new NodeRotate({
    filename: './err.log',
    overwrite: [ 'stderr' ]
});

console.log('out 1');
console.error('err 1');
console.log('out 2');
console.error('err 2');
