// Create a new stack for review of a PR
const path = require("path");

const { LocalWorkspace } = require("@pulumi/pulumi/automation");

async function run() {
  const stacks = LocalWorkspace.listStacks()

  stacks.array.forEach(stack => {
    console.log(stack)
  });
}

run().catch(function onRunError(error) {
  console.log(error);
  process.exit(1);
});
