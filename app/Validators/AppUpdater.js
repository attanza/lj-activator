"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class AppUpdater {
  get rules() {
    return {
      kode_produk: "required|string",
      name: "required|string",
      version: "required|string",
      info: "required|string",
      asar: "string",
    }
  }

  get messages() {
    return messages
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = AppUpdater
