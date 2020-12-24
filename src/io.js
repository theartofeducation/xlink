import fs from "fs"
import os from "os"
import path from "path"
import chalk from "chalk"
import walk from "walk-sync"
import { execSync } from "child_process"
import { isNotEmpty } from "./util"

export function getPackageList() {
  const lernaBin = path.resolve("./node_modules/.bin/lerna")
  const output = execSync(`${lernaBin} ls -l`)
  const items = output.toString().split("\n").filter(item => isNotEmpty(item))
  const packages = items.map(item => {
    const [name, version, packagePath] = item.replace(/\s\s+/g, " ").split(" ")
    return { name, version, path: packagePath }
  })

  return packages
}

export function getStatus({ selectedStatusType }) {
  selectedStatusType === "global" ?
    getGlobalStatus() :
    getLocalStatus()
}

export function getGlobalStatus() {
  const YARN_LINKS_ROOT = ".config/yarn/link"
  const rootLinksPath = path.resolve(os.homedir(), YARN_LINKS_ROOT)
  const entries = walk(rootLinksPath)
  const links = []

  entries.forEach(entry => {
    const entryPath = path.resolve(rootLinksPath, entry)
    const entryInfo = fs.lstatSync(entryPath)
    if (entryInfo.isSymbolicLink()) {
      const link = entryPath.replace(`${rootLinksPath}/`, "")
      const symlinkPath = fs.readlinkSync(entryPath)
      links.push({ link, symlinkPath })
    }
  })

  if (links.length > 0) {
    links.forEach(({ link, symlinkPath }) => {
      console.log(`${link} -> ${chalk.green(symlinkPath)}`)
    })
  } else {
    console.log("Yarn currently has no packages linked globally")
  }

  console.log("")
}

export function getLocalStatus() {
  const YARN_LINKS_ROOT = ".config/yarn/link"
  const currentFolderName = path.basename(process.cwd())
  const rootLinksPath = path.resolve(os.homedir(), YARN_LINKS_ROOT)
  const entries = walk(rootLinksPath)
  const links = []

  entries.forEach(entry => {
    const entryPath = path.resolve(rootLinksPath, entry)
    const entryInfo = fs.lstatSync(entryPath)

    if (entryInfo.isSymbolicLink()) {
      const link = entryPath.replace(`${rootLinksPath}/`, "")
      const symlinkPath = fs.readlinkSync(entryPath)
      if (
        link.includes(currentFolderName) ||
        symlinkPath.includes(currentFolderName)
      ) {
        links.push({ link, symlinkPath })
      }
    }
  })

  if (links.length > 0) {
    links.forEach(({ link, symlinkPath }) => {
      console.log(`${link} -> ${chalk.green(symlinkPath)}`)
    })
  } else {
    console.log("There are no local packages currently linked")
  }

  console.log("")
}

export function linkSharedDependencies({
  selectedSharedDependencies,
  targetPath,
  handler
}) {
  if (selectedSharedDependencies.length > 0) {
    if (handler && typeof handler === "function") {
      selectedSharedDependencies.forEach(dep => {
        const linkFromDir = path.resolve(__dirname, "node_modules", dep)

        handler({ dep, linkFromDir, linkTargetPath: targetPath })
      })
    }
  }
}

export function linkPackages({
  selectedPackages,
  packageList,
  targetPath,
  handler
}) {
  if (selectedPackages.length > 0) {
    if (handler && typeof handler === "function") {
      selectedPackages.forEach(pkg => {
        const { name, path: packagePath } = packageList.find(p => p.name === pkg)
        const linkFromDir = path.resolve(__dirname, "..", packagePath)

        handler({ dep: name, linkFromDir, linkTargetPath: targetPath })
      })
    }
  }
}
