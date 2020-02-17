"use strict";
const BActivator = use("App/Models/BActivator");
const EActivator = use("App/Models/EActivator");
const GActivator = use("App/Models/GActivator");
const KActivator = use("App/Models/KActivator");
const PActivator = use("App/Models/PActivator");
const UActivator = use("App/Models/UActivator");
const NPActivator = use("App/Models/NPActivator");
const NBActivator = use("App/Models/NBActivator");
const WbActivator = use("App/Models/WbActivator");
const WeActivator = use("App/Models/WeActivator");
const WgActivator = use("App/Models/WgActivator");
const WkActivator = use("App/Models/WkActivator");
const WpActivator = use("App/Models/WpActivator");
const WuActivator = use("App/Models/WuActivator");
const WnpActivator = use("App/Models/WnpActivator");
const WnbActivator = use("App/Models/WnbActivator");
const WnnActivator = use("App/Models/WnnActivator");
const NnActivator = use("App/Models/NnActivator");
const WnaActivator = use("App/Models/WnaActivator");
const NaActivator = use("App/Models/NaActivator");
const NfActivator = use("App/Models/NFActivator");
const WnfActivator = use("App/Models/WnfActivator");
const TestActivator = use("App/Models/TestActivator");
const Database = use("Database");

const existingKodeProduk = [
  "B",
  "E",
  "G",
  "K",
  "P",
  "U",
  "NB",
  "NP",
  "WB",
  "WE",
  "WG",
  "WK",
  "WP",
  "WU",
  "WNB",
  "WNP",
  "NN",
  "WNN",
  "WNA",
  "NA",
  "WNF",
  "NF",
  "Test"
];
const ActivatorName = use("App/Models/ActivatorName");
const ProductActivator = use("App/Models/Activator");

const { RedisHelper, ResponseParser, ErrorLog } = use("App/Helpers");

class KodeController {
  async kodeCheck({ request, response }) {
    var result = new Object();
    var Activator;
    const params = request.only(["kode_produk", "device_id"]);
    if (
      params.device_id == "" ||
      params.device_id == null ||
      params.kode_produk == null
    ) {
      result.message = "Error, invalid parameters";
      return response.json(result);
    }
    var activatorTable = "";
    const data = await ActivatorName.findBy("kode_produk", params.kode_produk);
    if (data) {
      Activator = ProductActivator;
      activatorTable = "activators";
    } else if (params.kode_produk === "B") {
      Activator = BActivator;
      activatorTable = "b_activators";
    } else if (params.kode_produk === "E") {
      Activator = EActivator;
      activatorTable = "e_activators";
    } else if (params.kode_produk === "G") {
      Activator = GActivator;
      activatorTable = "g_activators";
    } else if (params.kode_produk === "K") {
      Activator = KActivator;
      activatorTable = "k_activators";
    } else if (params.kode_produk === "P") {
      Activator = PActivator;
      activatorTable = "p_activators";
    } else if (params.kode_produk === "U") {
      Activator = UActivator;
      activatorTable = "u_activators";
    } else if (params.kode_produk === "NB") {
      Activator = NBActivator;
      activatorTable = "nb_activators";
    } else if (params.kode_produk === "NP") {
      Activator = NPActivator;
      activatorTable = "np_activators";
    } else if (params.kode_produk === "WB") {
      Activator = WbActivator;
      activatorTable = "wb_activators";
    } else if (params.kode_produk === "WE") {
      Activator = WeActivator;
      activatorTable = "we_activators";
    } else if (params.kode_produk === "WG") {
      Activator = WgActivator;
      activatorTable = "wg_activators";
    } else if (params.kode_produk === "WK") {
      Activator = WkActivator;
      activatorTable = "wk_activators";
    } else if (params.kode_produk === "WNB") {
      Activator = WnbActivator;
      activatorTable = "wnb_activators";
    } else if (params.kode_produk === "WNP") {
      Activator = WnpActivator;
      activatorTable = "wnp_activators";
    } else if (params.kode_produk === "WP") {
      Activator = WpActivator;
      activatorTable = "wp_activators";
    } else if (params.kode_produk === "WU") {
      Activator = WuActivator;
      activatorTable = "wu_activators";
    } else if (params.kode_produk === "WNN") {
      Activator = WnnActivator;
      activatorTable = "wnn_activators";
    } else if (params.kode_produk === "NN") {
      Activator = NnActivator;
      activatorTable = "nn_activators";
    } else if (params.kode_produk === "WNA") {
      Activator = WnaActivator;
      activatorTable = "wna_activators";
    } else if (params.kode_produk === "NA") {
      Activator = NaActivator;
      activatorTable = "na_activators";
    } else if (params.kode_produk === "WNF") {
      Activator = WnfActivator;
      activatorTable = "wnf_activators";
    } else if (params.kode_produk === "NF") {
      Activator = NfActivator;
      activatorTable = "nf_activators";
    } else {
      Activator = TestActivator;
      activatorTable = "test_activators";
    }

    var sql = await Database.select("id")
      .from(activatorTable)
      .where("device_id", params.device_id);
    if (sql) {
      if (sql.length > 0) {
        const kode = await Activator.find(sql[0].id);
        // console.log(kode)
        if (kode) {
          if (kode.kode_produk == params.kode_produk) {
            result.message = "success";
          } else {
            result.message = "Produk tidak sesuai";
          }
        }
      } else {
        var sql = await Database.select("id", "created_at")
          .from("trial_activators")
          .where("device_id", params.device_id)
          .where("kode_produk", params.kode_produk);
        if (sql) {
          if (sql.length > 0) {
            var createdDate = new Date(sql[0].created_at);
            var nowDate = new Date();
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            var millisBetween = nowDate.getTime() - createdDate.getTime();
            var days = millisBetween / millisecondsPerDay;
            days = Math.floor(days);
            if (days < 30) {
              result.days = days;
              result.message = "success";
            } else {
              result.days = days;
              result.message =
                "Member ID sudah kedaluarsa silahkan hubungi marketing kami";
            }
          } else {
            result.message = "Gagal, perangkat tidak terdaftar";
          }
        }
      }
    }
    return response.json(result);
  }

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
        sort_mode
      } = request.get();

      if (!page) page = 1;
      if (!limit) limit = 100;
      if (!sort_by) sort_by = "id";
      if (!sort_mode) sort_mode = "asc";

      // const redisKey = `KodeProduk_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}`;

      // let cached = await RedisHelper.get(redisKey);

      // if (cached && !search) {
      //   return cached;
      // }

      const data = await ActivatorName.query()
        .where(function() {
          if (search && search != "") {
            this.where("kode_produk", "like", `%${search}%`);
            this.orWhere("nama_produk", "like", `%${search}%`);
          }

          if (search_by && search_query) {
            this.where(search_by, search_query);
          }

          if (between_date && start_date && end_date) {
            this.whereBetween(between_date, [start_date, end_date]);
          }
        })
        .orderBy(sort_by, sort_mode)
        .paginate(page, limit);

      var data2 = data.toJSON();
      var existKodeProduk = {
        id: 91,
        kode_produk: "B",
        nama_produk: "M3 Kebidanan",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 92,
        kode_produk: "E",
        nama_produk: "M3 Ekonomi",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 93,
        kode_produk: "G",
        nama_produk: "M3 Kedokteran Gigi",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 94,
        kode_produk: "K",
        nama_produk: "M3 Kesehatan",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 95,
        kode_produk: "P",
        nama_produk: "M3 Keperawatan",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 96,
        kode_produk: "U",
        nama_produk: "M3 Kedokteran",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 97,
        kode_produk: "NB",
        nama_produk: "M3 Neo Bidan",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 98,
        kode_produk: "NP",
        nama_produk: "M3 Neo Perawat",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 99,
        kode_produk: "WB",
        nama_produk: "M3 Kebidanan Windows",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 100,
        kode_produk: "W3",
        nama_produk: "M3 Ekonomi Windows",
        initial_number: 5000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 101,
        kode_produk: "WG",
        nama_produk: "M3 Kedokteran Gigi Windows",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 102,
        kode_produk: "WK",
        nama_produk: "M3 Kesehatan Windows",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 103,
        kode_produk: "WP",
        nama_produk: "M3 Keperawatan Windows",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 104,
        kode_produk: "WU",
        nama_produk: "M3 Kedokteran Windows",
        initial_number: 3000,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 105,
        kode_produk: "WNB",
        nama_produk: "M3 Neo Bidan Windows",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 106,
        kode_produk: "WNP",
        nama_produk: "M3 Neo Perawat Windows",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 107,
        kode_produk: "NN",
        nama_produk: "Neo Ners",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 108,
        kode_produk: "WNN",
        nama_produk: "Neo Ners Windows",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 109,
        kode_produk: "WNA",
        nama_produk: "Neo Apoteker Windows",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 110,
        kode_produk: "NA",
        nama_produk: "Neo Apoteker",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 111,
        kode_produk: "NF",
        nama_produk: "Neo Farmasi",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      existKodeProduk = {
        id: 112,
        kode_produk: "WNF",
        nama_produk: "Neo Farmasi Windows",
        initial_number: 0,
        last_index: 0,
        created_at: "2019-04-30 18:32:16",
        updated_at: "2019-04-30 18:32:16"
      };
      data2.data.push(existKodeProduk);
      data2.total = data2.total + 22;
      var parsed = ResponseParser.apiCollection(data2);

      // if (!search || search == "") {
      //   await RedisHelper.set(redisKey, parsed);
      // }
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e.message);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}

module.exports = KodeController;
