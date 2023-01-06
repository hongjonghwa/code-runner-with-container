const { exec } = require("child_process");


const cmd = '\
docker run -t --rm \
 --name code-runner -h code-runner \
 --network none \
 --cpus 0.125 \
 -m 125m \
 -u user \
 -w /CODE \
 -v $(pwd)/code:/CODE \
 -p 80:8080 \
 code-runner-python:3.10-pandas '

console.log(cmd)
//cmd = "ls -la"
exec(cmd, (error, stdout, stderr) => {
    console.log('#####')
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
