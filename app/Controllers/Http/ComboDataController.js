"use strict"

const { RedisHelper, InArray } = use("App/Helpers")
const Role = use("App/Models/Role")
const Permission = use("App/Models/Permission")
const ActivatorName = use("App/Models/ActivatorName")

const existingKodeProduk = ["B", "E", "G", "K", "P", "U", "NB", "NP", "WB", "WE", "WG",
  "WK", "WP", "WU", "WNB", "WNP", "NN", "WNN", "WNA", "NA", "WNF", "NF", "Test"]

class ComboDataController {
  async index({ request, response }) {
    const { model, search } = request.get()
    switch (model) {

      case "Permission": {
        const data = await this.getPermissions()
        return response.status(200).send(data)
      }

      case "Role": {
        const data = await this.getRoles()
        return response.status(200).send(data)
      }

      case "Product": {
        const data = await this.getProducts()
        return response.status(200).send(data)
      }
      default:
        return response.status(400).send({
          message: "Model not found",
        })
    }
  }

  async getPermissions() {
    let redisKey = "Permission_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await Permission.query()
      .select("id", "name")
      .orderBy("id")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getRoles() {
    let redisKey = "Role_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await Role.query()
      .select("id", "name")
      .orderBy("id")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }
  async getProducts() {
    let redisKey = "Product_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const Database = use('Database')
    var sql = await Database.select('id', 'kode_produk').from('activator_names').orderBy('id')

    var dataLength = sql.length +1 
    var dataKodeProduk = []
    for (var i = 0; i < dataLength - 1; i++) {
      var dataExist = {
        "id": sql[i].id,
        "kode_produk": sql[i].kode_produk
      }
      dataKodeProduk.push(dataExist)
    }
    for (var i = 0; i < existingKodeProduk.length; i++) {
      var dataExist = {
        "id": dataLength + i,
        "kode_produk": existingKodeProduk[i]
      }
      dataKodeProduk.push(dataExist)
    }
    // await RedisHelper.set(rediskKey, data)
    let parsed = dataKodeProduk
    return parsed
  }
}

module.exports = ComboDataController
