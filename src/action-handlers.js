import {
  getStatus
} from "./io"

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
    preAction() {},
    handler() {},
    postAction() {}
  },
  unlink: {
    preAction() {},
    handler() {},
    postAction() {}
  }
}
