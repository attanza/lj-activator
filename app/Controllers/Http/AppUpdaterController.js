'use strict'

const AppUpdater = use("App/Models/AppUpdater")
const Env = use('Env')
const ActivatorName = use("App/Models/ActivatorName")
const { RedisHelper, ResponseParser, ErrorLog } = use("App/Helpers")
const { ActivityTraits } = use("App/Traits")
const Helpers = use("Helpers")
const Drive = use("Drive")
const fillable = ["kode_produk", "name", "version", "info"]
const existingKodeProduk = ["B", "E", "G", "K", "P", "U", "NB", "NP", "WB", "WE", "WG",
    "WK", "WP", "WU", "WNB", "WNP", "NN", "WNN", "WNA", "NA", "WNF", "NF", "Test"]


class AppUpdaterController {
    async index({ request, response }) {
        try {
            let {
                page,
                limit,
                search,
                search_by,
                search_query,
                between_date,
                start_date,
                end_date,
                sort_by,
                sort_mode,
                kode_produk,
            } = request.get()

            if (!page) page = 1
            if (!limit) limit = 100
            if (!sort_by) sort_by = "id"
            if (!sort_mode) sort_mode = "desc"

            const redisKey = `AppUpdater_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${kode_produk}`

            let cached = await RedisHelper.get(redisKey)

            if (cached && !search) {
                return cached
            }

            const data = await AppUpdater.query()
                // .with("target")
                .where(function () {
                    if (search && search != "") {
                        this.where("kode_produk", "like", `%${search}%`)
                        this.orWhere("name", "like", `%${search}%`)
                        // this.orWhere("tags", "like", `%${search}%`)
                        // this.orWhereHas("target", builder => {
                        //     builder.where("code", "like", `%${search}%`)
                        // })
                    }

                    if (kode_produk && kode_produk != "") {
                        this.where("kode_produk", kode_produk)
                    }

                    if (search_by && search_query) {
                        this.where(search_by, search_query)
                    }

                    if (between_date && start_date && end_date) {
                        this.whereBetween(between_date, [start_date, end_date])
                    }
                })
                .orderBy(sort_by, sort_mode)
                .paginate(page, limit)

            let parsed = ResponseParser.apiCollection(data.toJSON())

            if (!search || search == "") {
                await RedisHelper.set(redisKey, parsed)
            }
            return response.status(200).send(parsed)
        } catch (e) {
            ErrorLog(request, e)
            return response.status(500).send(ResponseParser.unknownError())
        }
    }

    /**
     * Store
     * Store New Update
     * Can only be done by Super Administrator
     */
    async store({ request, response, auth }) {
        try {
            let body = request.only(fillable)

            // Check if marketing report exist
            var target = await ActivatorName.findBy('kode_produk',
                body.kode_produk
            )
            if (!target) {
                for (var i = 0; i < existingKodeProduk.length; i++) {
                    if (body.kode_produk == existingKodeProduk[i]) {
                        target = true
                    }
                }
                if (!target) {
                    return response
                        .status(400)
                        .send(ResponseParser.errorResponse("Kode produk not found"))
                }
            }

            const docFile = request.file("file")

            if (!docFile) {
                return response
                    .status(400)
                    .send(ResponseParser.errorResponse("File to be uploaded is required"))
            }
            const name = `${body.kode_produk}_${new Date().getTime()}.${
                docFile.subtype
                }`

            await docFile.move(Helpers.publicPath("updater"), { name })

            if (!docFile.moved()) {
                return response
                    .status(400)
                    .send(ResponseParser.errorResponse("file failed to upload"))
            }
            body.asar = `/updater/${name}`
            const data = await AppUpdater.create(body)
            // await data.load("target")
            await RedisHelper.delete("AppUpdater_*")
            const activity = `Add App Update <Kode Produk ${body.kode_produk}>`
            await ActivityTraits.saveActivity(request, auth, activity)
            let parsed = ResponseParser.apiCreated(data.toJSON())
            return response.status(201).send(parsed)
        } catch (e) {
            ErrorLog(request, e)
            return response.status(500).send(ResponseParser.unknownError())
        }
    }

    /**
     * Show
     * Update by kode_produk
     */
    async show({ request, response }) {
        try {
            const id = request.params.id
            let redisKey = `AppUpdater_${id}`
            let cached = await RedisHelper.get(redisKey)
            if (cached) {
                return response.status(200).send(cached)
            }
            const data = await AppUpdater.find(id)
            if (!data) {
                return response.status(400).send(ResponseParser.apiNotFound())
            }
            data.latest = data.version
            data.source = data.asar
            let parsed = ResponseParser.apiItem(data.toJSON())
            await RedisHelper.set(redisKey, parsed)
            return response.status(200).send(parsed)
        } catch (e) {
            ErrorLog(request, e)
            return response.status(500).send(ResponseParser.unknownError())
        }
    }

    //POST newUpdater
    async postReqUpdateByKode({ request, response }) {
        try {
            const kode_produk = request.params.kode
            const Database = use('Database')
            const data = await Database.table('app_updaters').where('kode_produk', kode_produk).last()
            if (!data) {
                return response.json(JSON.stringify({
                    "name": "empty",
                    "version": "0.0.0",
                    "asar": "",
                    "latest": "0.0.0",
                    "source": "",
                    "info": "No available update"
                }).replace(/[\\/]/g, '\\/'))
            }
            data.latest = data.version
            data.source = data.asar
            // let parsed = ResponseParser.electronUpdater(data.toJSON())
            // return response.json({"id":data.id,"kode_produk":data.kode_produk,"name":data.name,
            // "version":data.version,"info":data.info,"asar":data.asar,"latest":data.version,
            // "source":data.asar})
            let environment = Env.get('NODE_ENV')
            var app_url;
            if (environment === 'production') {
                app_url = Env.get('PRODUCTION_APP_URL')
            } else {
                app_url = Env.get('APP_URL')
            }
            return response.json(JSON.stringify({
                "name": data.name,
                "version": data.version,
                "asar": app_url + data.asar,
                "latest": data.version,
                "source": app_url + data.asar,
                "info": data.info
            }).replace(/[\\/]/g, '\\/'))
        } catch (e) {
            ErrorLog(request, e)
            return response.status(500).send(ResponseParser.unknownError())
        }
    }

    /**
     * Update
     * Update AppUpdater by kode_produk
     * Can only be done by Super Administrator
     */
    async update({ request, response, auth }) {
        try {
            let body = request.only(fillable)
            const id = request.params.id
            const data = await AppUpdater.find(id)
            if (!data || data.length === 0) {
                return response.status(400).send(ResponseParser.apiNotFound())
            }
            // Check if kode produk exist
            var target = await ActivatorName.findBy('kode_produk',
                body.kode_produk
            )
            if (!target) {
                for (var i = 0; i < existingKodeProduk.length; i++) {
                    if (body.kode_produk == existingKodeProduk[i]) {
                        target = true
                    }
                }
                if (!target) {
                    return response
                        .status(400)
                        .send(ResponseParser.errorResponse("Kode produk not found"))
                }
            }

            await data.merge(body)
            await data.save()
            // await data.load("target")
            const activity = `Update App Updater <Update name ${body.name}>`
            await ActivityTraits.saveActivity(request, auth, activity)
            await RedisHelper.delete("AppUpdater_*")
            let parsed = ResponseParser.apiUpdated(data.toJSON())
            return response.status(200).send(parsed)
        } catch (e) {
            ErrorLog(request, e)
            return response.status(500).send(ResponseParser.unknownError())
        }
    }

    /**
     * Delete
     */
    async destroy({ request, response, auth }) {
        try {
            const id = request.params.id
            let data = await AppUpdater.find(id)
            if (!data) {
                return response.status(400).send(ResponseParser.apiNotFound())
            }

            let exists = await Drive.exists(Helpers.publicPath(data.asar))
            if (exists) {
                await Drive.delete(Helpers.publicPath(data.asar))
            }
            const activity = `Delete App Updater ID <${id}>`
            await ActivityTraits.saveActivity(request, auth, activity)
            await RedisHelper.delete("AppUpdater_*")
            await data.delete()
            return response.status(200).send(ResponseParser.apiDeleted())
        } catch (e) {
            ErrorLog(request, e)
            return response.status(500).send(ResponseParser.unknownError())
        }
    }
}

module.exports = AppUpdaterController
