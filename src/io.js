import { execSync } from "child_process"
import path from "path"
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
