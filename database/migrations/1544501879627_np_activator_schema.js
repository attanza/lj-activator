'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NpActivatorSchema extends Schema {
  up() {
    this.create('np_activators', (table) => {
      table.increments()
      table.string('kode_produk').nullable()
      table.string('nomor_member').nullable()
      table.string('serial_number').nullable()
      table.string('nama').nullable()
      table.string('email').nullable()
      table.string('phone').nullable()
      table.string('device_id').nullable()
      table.string('universitas').nullable()
      table.boolean('active').nullable()
      table.boolean('blocked').nullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('np_activators')
  }
}

module.exports = NpActivatorSchema
