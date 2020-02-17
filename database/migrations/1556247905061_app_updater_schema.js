'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppUpdaterSchema extends Schema {
  up() {
    this.create('app_updaters', (table) => {
      table.increments()
      table.string('kode_produk').notNullable()
      table.string('name').nullable()
      table.string('version').notNullable()
      table.string('info').notNullable()
      table.string('asar').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('app_updaters')
  }
}

module.exports = AppUpdaterSchema
