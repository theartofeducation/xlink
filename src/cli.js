import inquirer from "inquirer"
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt"
import pkg from "../package.json"
import {
  selectAction,
  selectSharedDependencies,
  selectPackages,
  selectTargetPath
} from "./prompts"
import {
  getPackageList
} from "./io"

export async function main() {
  console.log(`xlink v${pkg.version}\n`)

  inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection)

  const packageList = getPackageList()

  const prompts = [
    selectAction,
    selectSharedDependencies,
    selectPackages(packageList),
    selectTargetPath
  ]
  const answers = await inquirer.prompt(prompts)

  console.log({ answers })
}
