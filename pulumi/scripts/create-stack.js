// Create a new stack for review of a PR
const path = require("path");

const { LocalWorkspace } = require("@pulumi/pulumi/automation");

async function run() {
  const stackArgs = {
    stackName: process.env.PR_STACK_NAME, // the PR stackname
    workDir: path.join(__dirname, "../"), // the directory where our Pulumi.yaml exists
  };

  // select `review` stack
  const reviewWorkspace = await LocalWorkspace.selectStack({
    stackName: "review",
    workDir: stackArgs.workDir,
  });

  // create a new stack for the PR
  console.log(`Creating stack ${stackArgs.stackName}`);
  const stack = await LocalWorkspace.createOrSelectStack(stackArgs);

  // set the config of the PR stack to the review stack config such as gcp:region etc.
  console.log(
    `Setting ${stackArgs.stackName} stack config from review stack`,
  );
  const allConfig = await reviewWorkspace.getAllConfig()
  console.log("allConfig:", allConfig)
  await stack.setAllConfig(allConfig);
  // change gcp:region config value to be different than the review config
  await stack.setConfig("gcp:region", { value: "us-central1" });
}

run().catch(function onRunError(error) {
  console.log(error);
  process.exit(1);
});
