'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivatorNameSchema extends Schema {
  up() {
    this.create('activator_names', (table) => {
      table.increments()
      table.string('kode_produk').unique()
      table.string('nama_produk').nullable()
      table.integer('initial_number').notNullable()
      table.integer('last_index').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('activator_names')
  }
}

module.exports = ActivatorNameSchema
