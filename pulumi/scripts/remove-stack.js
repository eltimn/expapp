// Remove a PR stack
const path = require("path");

const { LocalWorkspace } = require("@pulumi/pulumi/automation");

async function run() {
  const stackArgs = {
    stackName: process.env.PR_STACK_NAME, // the PR stackname
    workDir: path.join(__dirname, "../"), // the directory where our Pulumi.yaml exists
  };

  const stack = await LocalWorkspace.createOrSelectStack(stackArgs);

  // remove the stack
  await LocalWorkspace.removeStack(stackArgs.stackName);
}

run().catch(function onRunError(error) {
  console.log(error);
  process.exit(1);
});
