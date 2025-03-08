const { execSync } = require('child_process')

try {
  // Get last release tag
  const lastTag = execSync('git describe --tags --abbrev=0').toString().trim()
  console.log(`Last release tag found: ${lastTag}`)

  // Get number of new commits since last tag
  const newCommits = execSync(`git rev-list ${lastTag}..HEAD --count`).toString().trim()
  console.log(`New commits since last release: ${newCommits}`)

  // No commits available -> Exit Code 1
  if (parseInt(newCommits, 10) === 0) {
    console.log('No commits since last release detected.')
    process.exit(1)
  }

  console.log('New commits found. Continue with successful result.')
  process.exit(0)
} catch (error) {
  console.log('No previous tags found or error occurred. Procedure ready to continue anyway.')
  console.error(error)
  process.exit(0) // If no tag available, success anyway
}
