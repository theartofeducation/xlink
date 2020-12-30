# Decision Log Book

Taken from [Decision Management in Software Engineering](https://medium.com/swlh/decision-management-in-software-engineering-ca60f9d40e02)

## 2020-12-23: How do we manage cross-project shared dependencies during active development of those shared components/packages

### Decision Makers

Bob Yexley

### Context

The manual process of creating the necessary links betwee shared packages from `ui-common` and other dependent web projects is cumbersome, laborious and time-consuming.

### Solution

Develop a CLI tool to facilitate automating the process of linking and unlinking components and shared packages between projects.

#### Why This Solution

I was unable to find an existing solution for doing this (really kinda shocked about that).

#### Limitation

Maintaining a custom solution for this will incur some time commitment.

### Rejected Solutions

Manually adding and removing the necessary symlinks to make active development with shared resources possible. I reject this.
