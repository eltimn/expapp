// Create a new stack for review of a PR
const path = require('path')

const { LocalWorkspace } = require('@pulumi/pulumi/automation')

async function run() {
  const stackName = process.env.STACK_NAME // the PR stackname
  const workspace = await LocalWorkspace.create({
    workDir: path.join(__dirname, '../'), // the directory where our Pulumi.yaml exists
  })

  const stacks = await workspace.listStacks()

  stacks.forEach((stack) => {
    console.log(stack)
  })

  const filtered = stacks.filter((s) => s.name === stackName)

  console.log('filtered:', filtered)
}

run().catch((error) => {
  console.log(error)
  process.exit(1)
})
