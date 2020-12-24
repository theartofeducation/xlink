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
  getPackageList,
  linkSharedDependencies,
  linkPackages
} from "./io"
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
  const {
    action,
    selectedSharedDependencies,
    selectedPackages,
    targetPath
    // restoreOriginalPackages
  } = selections

  const { preAction, handler, postAction } = actionHandlerMap[action]
  const shouldLinkSharedDependencies = (
    selectedSharedDependencies &&
    selectedSharedDependencies.length > 0
  )
  const shouldLinkPackages = (
    selectedPackages &&
    selectedPackages.length > 0
  )

  if (preAction && typeof preAction === "function") {
    preAction(selections)
  }

  if (shouldLinkSharedDependencies || shouldLinkPackages) {
    linkSharedDependencies({
      selectedSharedDependencies,
      targetPath,
      handler
    })

    linkPackages({
      selectedPackages,
      packageList,
      targetPath,
      handler
    })
  } else {
    handler(selections)
  }

  if (postAction && typeof postAction === "function") {
    postAction(selections)
  }
}
