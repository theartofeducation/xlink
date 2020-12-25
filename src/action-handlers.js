import {
  getStatus,
  processSelectedPackages,
  addPackage
} from "./commands"

export const actionHandlerMap = {
  status: {
    preAction(selections) {
      const { selectedStatusType } = selections
      console.log("Current link(s) status...")
      const message = selectedStatusType === "global" ?
        "These are the links that Yarn currently has registered globally:" :
        "Current locally linked packages:"

      console.log(`\n${message}\n`)
    },
    handler(selections) {
      getStatus(selections)
    },
    postAction() {}
  },
  link: {
    preAction(selections) {
      console.log("Linking local packages...")
    },
    handler(selections) {
      processSelectedPackages(selections)
    }
  },
  unlink: {
    preAction() {
      console.log("Unlinking local packages...")
    },
    handler(selections) {
      processSelectedPackages(selections)
    },
    postAction(selections) {
      const { restoreOriginalPackages } = selections

      if (restoreOriginalPackages) {
        console.log("Restoring original packages...")
        const {
          selectedSharedDependencies,
          selectedPackages,
          targetPath
        } = selections

        selectedSharedDependencies.forEach(pkg => addPackage({
          pkg,
          targetPath
        }))

        selectedPackages.forEach(pkg => addPackage({
          pkg,
          targetPath
        }))
      }
    }
  }
}
