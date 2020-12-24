# @aoeu/xlink

There are a number of challenges developers will encounter when tasked with developing a shared component/package project that is organized as a monorepo that is intended to be shared with dependent projects. A common workflow in this scenario will be to be actively developing components or packages in one project, while wanting to consume and use the component or package that is under active development in dependent project(s). Another challenge in this scenario is shared common dependencies between the two projects (most commonly, react and react-dom).

This scenario requires linking components/packages from the common project folders into the dependent project folders to make them available for use. This is accomplished by using the `yarn link` command.

_...more to come..._
