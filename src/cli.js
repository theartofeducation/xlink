import inquirer from "inquirer"
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt"
import pkg from "../package.json"
import {
  selectAction,
  selectSharedDependencies,
  selectPackages,
  selectTargetPath,
  selectRestoreOriginalPackages,
  selectGlobalOrLocalLinkStatus
} from "./prompts"
import {
  getPackageList
} from "./commands"
import {
  actionHandlerMap
} from "./action-handlers"

export async function main() {
  console.log(`xlink v${pkg.version}\n`)

  inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection)

  const packageList = getPackageList()

  const prompts = [
    selectAction,
    selectSharedDependencies,
    selectPackages(packageList),
    selectTargetPath,
    selectRestoreOriginalPackages,
    selectGlobalOrLocalLinkStatus
  ]
  const selections = await inquirer.prompt(prompts)
  const { action } = selections
  const { preAction, handler, postAction } = actionHandlerMap[action]

  if (preAction && typeof preAction === "function") {
    preAction(selections)
  }

  if (handler && typeof handler === "function") {
    handler({ ...selections, packageList })
  }

  if (postAction && typeof postAction === "function") {
    postAction(selections)
  }
}
