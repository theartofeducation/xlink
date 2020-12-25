# @aoeu/xlink

There are a number of challenges developers will encounter when tasked with developing a shared component/package project that is organized as a monorepo that is intended to be shared with dependent projects. A common workflow in this scenario will be to be actively developing components or packages in one project, while wanting to consume and use the component or package that is under active development in dependent project(s). Another challenge in this scenario is shared common dependencies between the two projects (most commonly, react and react-dom).

## The Problems

### Shared Dependencies

In the course of developing in a shared component/package library project (monorepo) in which live components/packages that are shared and consumed by another web project during active development, you will almost certainly run into the dreaded [Invalid Hook Call Warning](https://reactjs.org/warnings/invalid-hook-call-warning.html). This document won't go into detail about that issue, but if you're curious about it, in addition to that page in their documentation, you can read in-depth about it [here](https://github.com/facebook/react/issues/13991) and [here](https://github.com/facebook/react/issues/14257) as well. The solution for this issue is to setup symlinks to the dependencies that are shared between the library project and the project(s) that depend on the resources in it (most commonly `react` and `react-dom`, but could be others as well as projects grow).

For example, to share `react`, in the library project you would need to run the following commands from a terminal prompt:

```sh
cd ./node_modules/react
yarn link
```

Followed by, in the dependent project:

```sh
yarn link react
```

Not necessarily exceptionally difficult to do it one time, but it can be awkward and cumbersome, not to mention error prone if you forget the correct commands to issue, or the order in which to execute them, or the correct folders in which to execute them, etc. Easy to get wrong or to forget. Additionally, it can become tiresome to so repeatedly when unlinking and needing to reinstall the original dependency, or re-link again later. It just becomes a hassle over time.

### Linking Packages

Similarly (but still slightly different), when actively changing an existing component or package in the library project, or creating a new one, when you wish to consume and use that package in a dependent project, you have to link that package in both projects as well.

In the library project:

```sh
cd components/notification
yarn link
```

And in the dependent project:

```sh
yarn link notification
```

The same challenges exist as with shared dependencies. There needs to be a better way to simplify this process.

## The Solution

`xlink` is a CLI tool that facilitates this process by providing the user with interactive prompts to gather the information about the action they wish to take (`status`, `link`, `unlink`, etc), and subsequently executing the appropriate commands in the correct directories to accomplish the selected action for the user.

----

## TODO

* [ ] Add [`standard-version`](https://github.com/conventional-changelog/standard-version) for handling versioning and publishing
* [ ] Publish to npm or GitHub registry
* [ ] Add unit tests
* [ ] Add logic to support the use of a config file in which users can configure the shared dependencies they need to make available for linking.
* [ ] Add logic to check for the presence of `lerna` in the project/directory that xlink is being used in, both by checking for the binary, as well as checking for the presence of a `lerna.json` config file. Both are needed and must be present for xlink to work properly, and it fails with an error if either is not present when it is run. Need to fail gracefully and exit when it is not present.
* [ ] Add the ability to sync the version of common dependencies across projects (i.e., run `yarn install lib@version` in both projects to sync the version). Introspect the `dependencies` and `devDependencies` of both the source and target projects and look for packages that are common between the two, then query the npm registry for version information for each of those packages, then prompt the user to select a version they wish to sync to. (This is all just an idea, not yet fully thought through).
* [ ] For broader flexibility, support linking with npm (not _just_ yarn).
