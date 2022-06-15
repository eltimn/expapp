// Create a new stack for review of a PR
const path = require("path");

const { LocalWorkspace } = require("@pulumi/pulumi/automation");

async function run() {
  const workspace = await LocalWorkspace.create({
    workDir: path.join(__dirname, "../") // the directory where our Pulumi.yaml exists
  });

  workspace.listStacks().array.forEach(stack => {
    console.log(stack)
  });
}

run().catch(function onRunError(error) {
  console.log(error);
  process.exit(1);
});
