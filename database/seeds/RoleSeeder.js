"use strict"

const { Slug } = use("App/Helpers")
const Role = use("App/Models/Role")
const Database = use("Database")
const Factory = use("Factory")

class RoleSeeder {
  async run() {
    await Database.raw("SET FOREIGN_KEY_CHECKS = 0;")

    await Role.truncate()
    const roles = [
      "Super Administrator",
      "Administrator",
      "Supervisor",
      "Marketing",
      "Student",
    ]
    for (let i = 0; i < roles.length; i++) {
      await Role.create({
        name: roles[i],
        slug: Slug(roles[i]),
      })
    }

    // await Factory.model("App/Models/Role").createMany(30)
  }
}

module.exports = RoleSeeder
