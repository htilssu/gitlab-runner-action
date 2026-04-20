const core = require('@actions/core');
const {exec} = require('@actions/exec');
const path = require("path");

async function registerRunnerCmd() {
  let cmdArgs = [];
  cmdArgs.push(`--rm`)
  cmdArgs.push(`-v`, `/srv/gitlab-runner/config:/etc/gitlab-runner`)
  cmdArgs.push(`gitlab/gitlab-runner`)
  cmdArgs.push(`register`)
  cmdArgs.push(`--non-interactive`)
  cmdArgs.push(`--executor`, `docker`)
  cmdArgs.push(`--docker-image`, core.getInput('docker-image'))
  cmdArgs.push(`--url`, core.getInput('server_url'))
  cmdArgs.push(`--token`, core.getInput('registration-token'))
  cmdArgs.push(`--name`, core.getInput('name'))
  cmdArgs.push(`--docker-privileged=true`)

  await exec('docker run', cmdArgs);
}

async function unregisterRunnerCmd() {
  let cmdArgs = [];
  cmdArgs.push(`--rm`)
  cmdArgs.push(`-v`, `/srv/gitlab-runner/config:/etc/gitlab-runner`)
  cmdArgs.push(`gitlab/gitlab-runner`)
  cmdArgs.push(`unregister`)
  cmdArgs.push(`--name`, core.getInput('name'))

  await exec('docker run', cmdArgs);
}

async function startRunnerCmd() {
  let cmdArgs = []
  cmdArgs.push(`-d`)
  cmdArgs.push(`--name`, `gitlab-runner`)
  cmdArgs.push(`--restart`, `always`)
  cmdArgs.push(`-v`, `/srv/gitlab-runner/config:/etc/gitlab-runner`)
  cmdArgs.push(`-v`, `/var/run/docker.sock:/var/run/docker.sock`)
  cmdArgs.push(`gitlab/gitlab-runner`)

  await exec('docker run', cmdArgs);
}

async function stopRunnerCmd() {
  let cmdArgs = []
  cmdArgs.push(`gitlab-runner`)

  await exec('docker stop ', cmdArgs);
  await exec('docker rm ', cmdArgs);
}

async function checkJob() {
  process.env['TIMEOUT'] = core.getInput('timeout')
  await exec(`${path.resolve(__dirname, "dist")}/check-job.sh`)
}

async function registerRunner() {
  try {
    await registerRunnerCmd()
    await startRunnerCmd()
    await checkJob()
  } finally {
    await unregisterRunner()
  }
}

async function unregisterRunner() {
  await stopRunnerCmd()
  await unregisterRunnerCmd()
}

registerRunner()