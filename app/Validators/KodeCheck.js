"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class KodeCheck {
  get rules() {
    return {
      device_id: "required|string",
      kode_produk: "required|string",
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

module.exports = KodeCheck
