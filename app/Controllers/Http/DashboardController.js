'use strict'

const Dashboard = use('App/Models/Dashboard')
const { RedisHelper } = use('App/Helpers')
const User = use('App/Models/User')
const ActivatorName = use('App/Models/ActivatorName')
const existingKodeProduk = ["B", "E", "G", "K", "P", "U", "NB", "NP", "WB", "WE", "WG",
  "WK", "WP", "WU", "WNB", "WNP", "NN", "WNN", "WNA", "NA", "WNF", "NF", "Test"]

class DashboardController {
  async index({ response }) {
    const totalActivatorNames = await ActivatorName.getCount()
    var totalProduct = totalActivatorNames + existingKodeProduk.length
    var dashboard = JSON.stringify({
      "total_products": totalProduct,
    })
    return response.status(200).send(dashboard)
  }

  async store({ response }) {
    const dashboard = await this.storeDashboardData()
    return response.status(200).send(dashboard)
  }

  async storeDashboardData() {
    const totalMarketings = await User.query()
      .whereHas('roles', builder => {
        builder.where('slug', 'marketing')
      })
      .where('is_active', 1)
      .count('* as total')

    const dashboardDetails = {
      total_products: totalProducts[0].total,
    }

    const dashboard = await Dashboard.first()
    dashboard.merge(dashboardDetails)
    await dashboard.save()

    const redisKey = 'Dashboard_Data'
    await RedisHelper.delete(redisKey)
    return dashboard
  }
}

module.exports = DashboardController
