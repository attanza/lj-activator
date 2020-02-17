"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class CreateCode {
  get rules() {
    return {
      kode_produk: "required|string",
      jumlah: "required|integer",
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

module.exports = CreateCode
