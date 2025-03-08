const { execSync } = require('child_process')
const fs = require('fs')

try {
  let lastTag
  try {
    lastTag = execSync('git describe --tags --abbrev=0').toString().trim()
    console.log(`Last release tag found: ${lastTag}`)
  } catch (error) {
    console.log('No previous tags found. Using initial commit as reference.')
    lastTag = execSync('git rev-list --max-parents=0 HEAD').toString().trim()
  }

  const newCommits = execSync(`git rev-list ${lastTag}..HEAD --count`).toString().trim()
  console.log(`New commits since last release: ${newCommits}`)

  if (parseInt(newCommits, 10) === 0) {
    console.log('No commits since last release detected.')
    fs.appendFileSync(process.env.GITHUB_ENV, `START_RELEASE=false\n`)
    process.exit(0)
  }

  console.log('New commits found. Continue with successful result.')
  fs.appendFileSync(process.env.GITHUB_ENV, `START_RELEASE=true\n`)
  process.exit(0)
} catch (error) {
  console.error('Error occurred while checking for new commits:', error)
  fs.appendFileSync(process.env.GITHUB_ENV, `START_RELEASE=true\n`)
  process.exit(0)
}
