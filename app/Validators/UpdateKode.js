"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class UpdateKode {
  get rules() {
    return {
      serial_number: "required|string",
      kode_produk: "required|string",
      nama: "string",
      email: "string",
      phone: "string",
      device_id: "required|string",
      universitas: "string"
    };
  }

  get messages() {
    return messages;
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages));
  }
}

module.exports = UpdateKode;
