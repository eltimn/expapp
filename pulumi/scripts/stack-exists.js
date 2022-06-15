// Create a new stack for review of a PR
const path = require("path");

const { LocalWorkspace } = require("@pulumi/pulumi/automation");

async function run() {
  const stackArgs = {
    workDir: path.join(__dirname, "../"), // the directory where our Pulumi.yaml exists
  };

  // select `review` stack
  const reviewWorkspace = await LocalWorkspace.selectStack({
    stackName: "review",
    workDir: stackArgs.workDir,
  });

  LocalWorkspace.listStacks().array.forEach(stack => {
    console.log(stack)
  });
}

run().catch(function onRunError(error) {
  console.log(error);
  process.exit(1);
});
