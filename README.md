# node-rotate

Rewrite some stream to file.

### Usage
```JavaScript
'use strict';

const NodeRotate = require('../index');

const _stdOut = new NodeRotate({
    filename: './out.log'
});

const options = {
    filename: './err.log'
};

const _stdErr = new NodeRotate(options);

process.stdout.write = _stdOut.write.bind(_stdOut);
process.stderr.write = _stdErr.write.bind(_stdErr);

console.log('out 1');
console.error('err 1');
console.log('out 2');
console.error('err 2');
```

### Options
```JavaScript
{
    "filename": "[String] destination file path",
    "retryCount": "[Number] retry count when write to file error"
    "reconnectCount": "[Number] reconnect to file when write to file error count beyond this value"
}
```
