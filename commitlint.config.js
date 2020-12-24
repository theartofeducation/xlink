const conventionalConfig = require("@commitlint/config-conventional")
const { rules: defaultRules } = conventionalConfig

/**
 * Extend "@commitlint/config-conventional" with adjustments to
 * types allowed:
 * -- change "feat" to "feature"
 * -- change "perf" to "performance"
 * -- add "wip"
 */
module.exports = Object.assign({}, conventionalConfig, {
  rules: Object.assign({}, defaultRules, {
    "type-enum": [2, "always", [
      "build",
      "chore",
      "ci",
      "docs",
      "feature",
      "fix",
      "performance",
      "refactor",
      "revert",
      "style",
      "test",
      "wip"
    ]]
  })
})
