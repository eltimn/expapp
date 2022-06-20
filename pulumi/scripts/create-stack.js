// Create a new stack for review of a PR
const path = require("path");

const { LocalWorkspace } = require("@pulumi/pulumi/automation");

async function run() {
  const stackPrefix = process.env.STACK_PREFIX
  const gcpRegion = process.env.GCP_REGION
  const gitBranch = process.env.GIT_BRANCH
  const gitSha = process.env.GIT_SHA
  const imageName = process.env.IMAGE_NAME

  const stackArgs = {
    stackName: `${stackPrefix}-${gitBranch}`,
    workDir: path.join(__dirname, "../"), // the directory where our Pulumi.yaml exists
  };

  // select `review` stack
  const reviewStack = await LocalWorkspace.selectStack({
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
  const reviewAllConfig = await reviewStack.getAllConfig()
  // console.log("review reviewAllConfig:", reviewAllConfig)
  await stack.setAllConfig(reviewAllConfig);

  // set config
  await stack.setConfig("gcp:region", { value: gcpRegion });
  await stack.setConfig("git_branch", { value: gitBranch });
  await stack.setConfig("git_sha", { value: gitSha });
  await stack.setConfig("image_name", { value: imageName })
}

run().catch(function onRunError(error) {
  console.log(error);
  process.exit(1);
});
