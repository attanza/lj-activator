"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class CreateCodeProduct {
  get rules() {
    return {
      kode_produk: "required|string",
      nama_produk: "required|string",
      initial_number: "required|integer"
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

module.exports = CreateCodeProduct
