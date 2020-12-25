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

export function processSelectedPackages(selections) {
  const {
    action,
    packageList,
    selectedSharedDependencies,
    selectedPackages,
    targetPath
  } = selections

  const actionHandler = action === "link" ? linkPackage : unlinkPackage

  const shouldProcessSharedDependencies = (
    selectedSharedDependencies &&
    selectedSharedDependencies.length > 0
  )

  const shouldProcessLocalPackages = (
    selectedPackages &&
    selectedPackages.length > 0
  )

  if (shouldProcessSharedDependencies) {
    selectedSharedDependencies.forEach(pkg => {
      const linkFromDir = path.resolve(process.cwd(), "node_modules", pkg)
      actionHandler({ pkg, linkFromDir, linkTargetPath: targetPath })
    })
  }

  if (shouldProcessLocalPackages) {
    selectedPackages.forEach(pkg => {
      const { name, path: packagePath } = packageList.find(p => p.name === pkg)
      const linkFromDir = path.resolve(process.cwd(), packagePath)
      actionHandler({ pkg: name, linkFromDir, linkTargetPath: targetPath })
    })
  }
}

function handleExecSyncResult(error, stdout, stder) {
  if (error) {
    console.error(`ERROR: ${error}`)
  }
}

export function linkPackage({
  pkg,
  linkFromDir,
  linkTargetPath
}) {
  console.log(`"${pkg}" -> ${linkTargetPath}`)
  execSync("yarn link", { cwd: linkFromDir }, handleExecSyncResult)
  execSync(`yarn link "${pkg}"`, { cwd: linkTargetPath }, handleExecSyncResult)
}

export function unlinkPackage({
  pkg,
  linkFromDir,
  linkTargetPath
}) {
  console.log(`Unlinking "${pkg}" from ${linkTargetPath}`)
  execSync(`yarn unlink "${pkg}"`, { cwd: linkTargetPath }, handleExecSyncResult)
  execSync("yarn unlink", { cwd: linkFromDir }, handleExecSyncResult)
}

export function addPackage({
  pkg,
  targetPath
}) {
  execSync(`yarn add ${pkg}`, { cwd: targetPath }, handleExecSyncResult)
}
