import path from "path"

const DEFAULT_SHARED_DEPENDENCIES = [
  "react",
  "react-dom"
]

export const selectAction = {
  name: "action",
  type: "list",
  message: "Action",
  choices: ["status", "link", "unlink"]
}

export const selectSharedDependencies = {
  when: ({ action }) => action !== "status",
  name: "selectedSharedDependencies",
  type: "checkbox",
  message: "Shared Dependencies:",
  choices: DEFAULT_SHARED_DEPENDENCIES,
  default: DEFAULT_SHARED_DEPENDENCIES
}

export const selectPackages = packageList => ({
  when: ({ action }) => action !== "status",
  name: "selectedPackages",
  type: "checkbox",
  message: "Packages:",
  choices() {
    return packageList.map(({ name, version }) => {
      return `${name}`
    })
  }
})

export const selectTargetPath = {
  when: ({ action }) => action !== "status",
  name: "targetPath",
  type: "file-tree-selection",
  message: "Path of the project to link to:",
  root: path.resolve(".."),
  onlyShowDir: true
}

export const selectRestoreOriginalPackages = {
  when: ({ action }) => action === "unlink",
  name: "restoreOriginalPackages",
  type: "confirm",
  message: "Restore original packages?",
  default: true
}

export const selectGlobalOrLocalLinkStatus = {
  when: ({ action }) => action === "status",
  name: "selectedStatusType",
  type: "list",
  message: "Global or Local status?",
  choices: ["local", "global"]
}
