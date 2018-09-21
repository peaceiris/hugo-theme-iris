const exec = require('child_process').exec;

var command = 'hugo version';

exec(command, (error, stdout, stderr) => {
    process.stdout.write(stdout);
});
