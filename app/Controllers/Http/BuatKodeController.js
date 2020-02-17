'use strict'

const BActivator = use('App/Models/BActivator')
const EActivator = use('App/Models/EActivator')
const GActivator = use('App/Models/GActivator')
const KActivator = use('App/Models/KActivator')
const PActivator = use('App/Models/PActivator')
const UActivator = use('App/Models/UActivator')
const NPActivator = use('App/Models/NPActivator')
const NBActivator = use('App/Models/NBActivator')
const WbActivator = use('App/Models/WbActivator')
const WeActivator = use('App/Models/WeActivator')
const WgActivator = use('App/Models/WgActivator')
const WkActivator = use('App/Models/WkActivator')
const WpActivator = use('App/Models/WpActivator')
const WuActivator = use('App/Models/WuActivator')
const WnpActivator = use('App/Models/WnpActivator')
const WnbActivator = use('App/Models/WnbActivator')
const WnnActivator = use('App/Models/WnnActivator')
const NnActivator = use('App/Models/NnActivator')
const WnaActivator = use('App/Models/WnaActivator')
const NaActivator = use('App/Models/NaActivator')
const WnfActivator = use('App/Models/WnfActivator')
const NfActivator = use('App/Models/NFActivator')
const Activator = use('App/Models/Activator')

const TestActivator = use('App/Models/TestActivator')
const Database = use('Database')
const Cryptr = use('cryptr')

const cryptr = new Cryptr('m3secret2018')
var cards = 'cards'

//BUAT KODE PRODUK
const ActivatorName = use("App/Models/ActivatorName")
const { RedisHelper, ResponseParser, ErrorLog } = use("App/Helpers")
const { ActivityTraits } = use("App/Traits")
const fillable = ["kode_produk", "nama_produk", "initial_number"]
const existingKodeProduk = ["B", "E", "G", "K", "P", "U", "NB", "NP", "WB", "WE", "WG",
    "WK", "WP", "WU", "WNB", "WNP", "NN", "WNN", "WNA", "NA", "WNF", "NF", "Test"]
//


class BuatKodeController {
    async buatKode({ request, view }) {
        var results = new Object()
        var activator;
        var activatorTable;
        var namaProduk;
        var initialId = 0;
        const activatorInfo = request.only(['kode_produk', 'jumlah'])
        await RedisHelper.delete("ActivatorName_*")
        const data = await ActivatorName.findBy('kode_produk', activatorInfo.kode_produk)
        if (data) {
            namaProduk = data.nama_produk
            initialId = data.initial_number
            var lastIndex = data.last_index + 1
            var id = 0
            id = lastIndex + initialId
            // console.log('jumlah = ' + activatorInfo.jumlah)
            var items = []

            for (var i = 0; i < activatorInfo.jumlah; i++) {
                var object = new Object();
                object.kode_produk = activatorInfo.kode_produk
                var year = new Date().getFullYear().toString().substr(-2)
                var s = "000000" + id;
                var number = s.substr(s.length - 5);
                var nomor_member = year + '-' + number + ' ' + activatorInfo.kode_produk
                object.nomor_member = nomor_member
                // console.log('nomor=' + i);
                const encryptedString = cryptr.encrypt(nomor_member)
                object.serial_number = encryptedString.substr(-10)
                object.active = 0
                object.blocked = 0
                object.namaProduk = namaProduk
                items.push(object)
                // var result = await activator.save()
                // console.log(items)
                id = id + 1;
            }
            try {
                items.forEach(async (item) => {
                    activator = new Activator()
                    if (activatorInfo.kode_produk.length == 1) {
                        cards = 'cards'
                    }
                    else if ((activatorInfo.kode_produk.length == 2) && (activatorInfo.kode_produk.indexOf("N") > -1)) {
                        cards = 'cardsNN'
                    }
                    else if ((activatorInfo.kode_produk.length == 3) && (activatorInfo.kode_produk.indexOf("WN") > -1)) {
                        cards = 'cardsWNN'
                    }
                    else if ((activatorInfo.kode_produk.length == 2) && (activatorInfo.kode_produk.indexOf("W") == 0)) {
                        cards = 'cards2'
                    }
                    else {
                        cards = 'cards'
                    }
                    activator.kode_produk = item.kode_produk
                    activator.nomor_member = item.nomor_member
                    // console.log(item.nomor_member)
                    activator.serial_number = item.serial_number
                    activator.active = 0
                    activator.blocked = 0
                    await activator.save()
                    // results.push(item)
                    // console.log(item)
                })
                data.last_index = id - initialId - 1
                await data.save()
                results.result = items
                var pageSize = 10;
                var groups = items.map(function (y, index) {
                    return index % pageSize === 0 ?
                        items.slice(index, index + pageSize) : null;
                })
                    .filter(function (y) { return y; });
                // console.log(groups)
                return view.render(cards, { groups: groups })
            } catch (e) {
                //  console.log('error:' + e.message)
                results.message = e.message
            }
            return results
        }
        else if (activatorInfo.kode_produk == 'B') {
            activatorTable = 'b_activators'
            namaProduk = 'M3 Kebidanan'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'E') {
            activatorTable = 'e_activators'
            namaProduk = 'M3 Ekonomi'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == 'G') {
            activatorTable = 'g_activators'
            namaProduk = 'M3 Kedokteran Gigi'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'K') {
            activatorTable = 'k_activators'
            namaProduk = 'M3 Kesehatan'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'P') {
            activatorTable = 'p_activators'
            namaProduk = 'M3 Keperawatan'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'U') {
            activatorTable = 'u_activators'
            namaProduk = 'M3 Kedokteran'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'NB') {
            activatorTable = 'nb_activators'
            namaProduk = 'M3 Neo Bidan'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == 'NP') {
            activatorTable = 'np_activators'
            namaProduk = 'M3 Neo Perawat'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == 'WB') {
            activatorTable = 'wb_activators'
            namaProduk = 'M3 Kebidanan'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'WE') {
            activatorTable = 'we_activators'
            namaProduk = 'M3 Ekonomi Windows'
            initialId = 5000
        }
        else if (activatorInfo.kode_produk == 'WG') {
            activatorTable = 'wg_activators'
            namaProduk = 'M3 Kedokteran Gigi'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'WK') {
            activatorTable = 'wk_activators'
            namaProduk = 'M3 Kesehatan'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'WP') {
            activatorTable = 'wp_activators'
            namaProduk = 'M3 Keperawatan'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'WU') {
            activatorTable = 'wu_activators'
            namaProduk = 'M3 Kedokteran'
            initialId = 3000
        }
        else if (activatorInfo.kode_produk == 'WNB') {
            activatorTable = 'wnb_activators'
            namaProduk = 'M3 Neo Bidan'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == 'WNP') {
            activatorTable = 'wnp_activators'
            namaProduk = 'M3 Neo Perawat'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == "NN") {
            activatorTable = 'nn_activators'
            namaProduk = 'Neo Ners'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == "WNN") {
            activatorTable = 'wnn_activators'
            namaProduk = 'Windows Neo Ners'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == "WNA") {
            activatorTable = 'wna_activators'
            namaProduk = 'Windows Neo Apoteker '
            initialId = 0
        }
        else if (activatorInfo.kode_produk == "NA") {
            activatorTable = "na_activators"
            namaProduk = "Neo Apoteker"
            initialId = 0
        }
        else if (activatorInfo.kode_produk == "WNF") {
            activatorTable = 'wnf_activators'
            namaProduk = 'Windows Neo Farmasi'
            initialId = 0
        }
        else if (activatorInfo.kode_produk == "NF") {
            activatorTable = "nf_activators"
            namaProduk = "Neo Farmasi"
            initialId = 0
        }
        else {
            activatorTable = 'test_activators'
            namaProduk = 'M3 Test'
            initialId = 3000
        }

        var id = 0
        //await RedisHelper.delete("INFORMATION_SCHEMA.TABLES")
        var sql = await Database.select('AUTO_INCREMENT').from('INFORMATION_SCHEMA.TABLES')
            .where('TABLE_SCHEMA', 'AppActivator')
            .where('TABLE_NAME', activatorTable)
        if (sql) {
            id = sql[0].AUTO_INCREMENT + initialId

            // console.log('jumlah = ' + activatorInfo.jumlah)
            var items = []

            for (var i = 0; i < activatorInfo.jumlah; i++) {
                var object = new Object();
                object.kode_produk = activatorInfo.kode_produk
                var year = new Date().getFullYear().toString().substr(-2)
                var s = "000000" + id;
                var number = s.substr(s.length - 5);
                var nomor_member = year + '-' + number + ' ' + activatorInfo.kode_produk
                object.nomor_member = nomor_member
                // console.log('nomor=' + i);
                const encryptedString = cryptr.encrypt(nomor_member)
                object.serial_number = encryptedString.substr(-10)
                object.active = 0
                object.blocked = 0
                object.namaProduk = namaProduk
                items.push(object)
                // var result = await activator.save()
                // console.log(items)
                id = id + 1;
            }
            try {
                items.forEach(async (item) => {
                    if (activatorInfo.kode_produk == 'B') {
                        activator = new BActivator()
                        cards = 'cards'
                    }
                    else if (activatorInfo.kode_produk == 'E') {
                        activator = new EActivator()
                        cards = 'cards'
                    }
                    else if (activatorInfo.kode_produk == 'G') {
                        activator = new GActivator()
                        cards = 'cards'
                    }
                    else if (activatorInfo.kode_produk == 'K') {
                        activator = new KActivator()
                        cards = 'cards'
                    }
                    else if (activatorInfo.kode_produk == 'P') {
                        activator = new PActivator()
                        cards = 'cards'
                    }
                    else if (activatorInfo.kode_produk == 'U') {
                        activator = new UActivator()
                        cards = 'cards'
                    }
                    else if (activatorInfo.kode_produk == 'NB') {
                        activator = new NBActivator()
                        cards = 'cardsNN'
                    }
                    else if (activatorInfo.kode_produk == 'NP') {
                        activator = new NPActivator()
                        cards = 'cardsNN'
                    }
                    else if (activatorInfo.kode_produk == 'WB') {
                        activator = new WbActivator()
                        cards = 'cards2'
                    }
                    else if (activatorInfo.kode_produk == 'WE') {
                        activator = new WeActivator()
                        cards = 'cards2'
                    }
                    else if (activatorInfo.kode_produk == 'WG') {
                        activator = new WgActivator()
                        cards = 'cards2'
                    }
                    else if (activatorInfo.kode_produk == 'WK') {
                        activator = new WkActivator()
                        cards = 'cards2'
                    }
                    else if (activatorInfo.kode_produk == 'WP') {
                        activator = new WpActivator()
                        cards = 'cards2'
                    }
                    else if (activatorInfo.kode_produk == 'WU') {
                        activator = new WuActivator()
                        cards = 'cards2'
                    }
                    else if (activatorInfo.kode_produk == 'NN') {
                        activator = new NnActivator()
                        cards = 'cardsNN'
                    }
                    else if (activatorInfo.kode_produk == 'WNB') {
                        activator = new WnbActivator()
                        cards = 'cardsWNN'
                    }
                    else if (activatorInfo.kode_produk == 'WNP') {
                        activator = new WnpActivator()
                        cards = 'cardsWNN'
                    }
                    else if (activatorInfo.kode_produk == 'WNN') {
                        activator = new WnnActivator()
                        cards = 'cardsWNN'
                    }
                    else if (activatorInfo.kode_produk == 'WNA') {
                        activator = new WnaActivator()
                        cards = 'cardsWNN'
                    }
                    else if (activatorInfo.kode_produk == 'NA') {
                        activator = new NaActivator()
                        cards = 'cardsNN'
                    }
                    else if (activatorInfo.kode_produk == 'WNF') {
                        activator = new WnfActivator()
                        cards = 'cardsWNN'
                    }
                    else if (activatorInfo.kode_produk == 'NF') {
                        activator = new NfActivator()
                        cards = 'cardsNN'
                    }
                    else {
                        activator = new TestActivator()
                    }
                    activator.kode_produk = item.kode_produk
                    activator.nomor_member = item.nomor_member
                    // console.log(item.nomor_member)
                    activator.serial_number = item.serial_number
                    activator.active = 0
                    activator.blocked = 0
                    await activator.save()
                    // results.push(item)
                    // console.log(item)
                })
                results.result = items
                var pageSize = 10;
                var groups = items.map(function (y, index) {
                    return index % pageSize === 0 ?
                        items.slice(index, index + pageSize) : null;
                })
                    .filter(function (y) { return y; });
                // console.log(groups)
                return view.render(cards, { groups: groups })
            } catch (e) {
                //  console.log('error:' + e.message)
                results.message = e.message
            }
        }
        return results;
    }

    async buatKodeProduk({ request, response, auth }) {
        try {
            let body = request.only(fillable)
            for (var i = 0; i < existingKodeProduk.length; i++) {
                if (body.kode_produk === existingKodeProduk[i]) {
                    let errorMessage = "Kode Produk " + body.kode_produk + " sudah ada"
                    return response.status(400).send(ResponseParser.errorResponse(errorMessage))
                }
            }
            await RedisHelper.delete("ActivatorName_*")
            const data = await ActivatorName.create(body)
            const activity = `Add new ActivatorName '${data.kode_produk}'`
            await ActivityTraits.saveActivity(request, auth, activity)
            let parsed = ResponseParser.apiCreated(data.toJSON())
            return response.status(201).send(parsed)
        } catch (e) {
            ErrorLog(request, e)
            return response.status(500).send(ResponseParser.errorResponse(e.message))
        }
    }
}

module.exports = BuatKodeController
