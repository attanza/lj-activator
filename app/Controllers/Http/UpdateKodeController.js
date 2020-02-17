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
const ProductActivator = use("App/Models/Activator");
const ActivatorName = use("App/Models/ActivatorName");
const AppUpdater = use("App/Models/AppUpdater");
const TrialActivator = use("App/Models/TrialActivator");

const randomstring = require("randomstring");

class UpdateKodeController {
  async updateKode({ request, response }) {
    var result = new Object();
    var activatorTable = "";
    var Activator;
    const kodeInfo = request.only([
      "serial_number",
      "kode_produk",
      "nama",
      "email",
      "phone",
      "device_id",
      "universitas"
    ]);
    try {
      const data = await ActivatorName.findBy(
        "kode_produk",
        kodeInfo.kode_produk
      );
      if (data) {
        Activator = ProductActivator;
        activatorTable = "activators";
      } else if (kodeInfo.kode_produk === "B") {
        Activator = BActivator;
        activatorTable = "b_activators";
      } else if (kodeInfo.kode_produk === "E") {
        Activator = EActivator;
        activatorTable = "e_activators";
      } else if (kodeInfo.kode_produk === "G") {
        Activator = GActivator;
        activatorTable = "g_activators";
      } else if (kodeInfo.kode_produk === "K") {
        Activator = KActivator;
        activatorTable = "k_activators";
      } else if (kodeInfo.kode_produk === "P") {
        Activator = PActivator;
        activatorTable = "p_activators";
      } else if (kodeInfo.kode_produk === "U") {
        Activator = UActivator;
        activatorTable = "u_activators";
      } else if (kodeInfo.kode_produk === "NB") {
        Activator = NBActivator;
        activatorTable = "nb_activators";
      } else if (kodeInfo.kode_produk === "NP") {
        Activator = NPActivator;
        activatorTable = "np_activators";
      } else if (kodeInfo.kode_produk === "WB") {
        Activator = WbActivator;
        activatorTable = "wb_activators";
      } else if (kodeInfo.kode_produk === "WE") {
        Activator = WeActivator;
        activatorTable = "we_activators";
      } else if (kodeInfo.kode_produk === "WG") {
        Activator = WgActivator;
        activatorTable = "wg_activators";
      } else if (kodeInfo.kode_produk === "WK") {
        Activator = WkActivator;
        activatorTable = "wk_activators";
      } else if (kodeInfo.kode_produk === "WNB") {
        Activator = WnbActivator;
        activatorTable = "wnb_activators";
      } else if (kodeInfo.kode_produk === "WNP") {
        Activator = WnpActivator;
        activatorTable = "wnp_activators";
      } else if (kodeInfo.kode_produk === "WP") {
        Activator = WpActivator;
        activatorTable = "wp_activators";
      } else if (kodeInfo.kode_produk === "WU") {
        Activator = WuActivator;
        activatorTable = "wu_activators";
      } else if (kodeInfo.kode_produk === "WNN") {
        Activator = WnnActivator;
        activatorTable = "wnn_activators";
      } else if (kodeInfo.kode_produk === "NN") {
        Activator = NnActivator;
        activatorTable = "nn_activators";
      } else if (kodeInfo.kode_produk === "WNA") {
        Activator = WnaActivator;
        activatorTable = "wna_activators";
      } else if (kodeInfo.kode_produk === "NA") {
        Activator = NaActivator;
        activatorTable = "na_activators";
      } else if (kodeInfo.kode_produk === "WNF") {
        Activator = WnfActivator;
        activatorTable = "wnf_activators";
      } else if (kodeInfo.kode_produk === "NF") {
        Activator = NfActivator;
        activatorTable = "nf_activators";
      } else {
        Activator = TestActivator;
        activatorTable = "test_activators";
      }
      // console.log(kodeInfo.universitas)
      var sql = await Database.select("id", "blocked")
        .from(activatorTable)
        .where("serial_number", kodeInfo.serial_number);
      if (sql) {
        if (sql.length > 0) {
          if (sql[0].blocked == 1) {
            result.message = "Serial number ini di block";
            return response.status(403).json(result);
          }
          const kode = await Activator.find(sql[0].id);
          if (kode.device_id != null) {
            result.message = "Serial number sudah pernah di registrasi";
            return response.status(401).json(result);
          }
          // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
          if (kode.kode_produk === kodeInfo.kode_produk) {
            // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
            // console.log(kodeInfo.universitas)
            kode.nama = kodeInfo.nama;
            kode.email = kodeInfo.email;
            kode.phone = kodeInfo.phone;
            kode.device_id = kodeInfo.device_id;
            kode.universitas = kodeInfo.universitas;
            kode.active = 1;
            await kode.save();
            result.message = "success";
            result.result = kode;
            return response.status(200).json(result);
          } else {
            result.message = "Serial number tidak sesuai dengan produk";
            return response.status(401).json(result);
          }
        } else {
          result.message = "Kode serial tidak dikenali";
          return response.status(401).json(result);
        }
      } else {
        result.message = "Kode serial tidak dikenali";
        return response.status(401).json(result);
      }
    } catch (e) {
      result.message = e.message;
      return response.status(401).json(result);
    }
  }

  async updateKodePc({ request, response }) {
    var result = new Object();
    var activatorTable = "";
    var Activator;
    const kodeInfo = request.only([
      "serial_number",
      "kode_produk",
      "nama",
      "email",
      "phone",
      "device_id",
      "universitas"
    ]);
    try {
      const data = await ActivatorName.findBy(
        "kode_produk",
        kodeInfo.kode_produk
      );
      if (data) {
        Activator = ProductActivator;
        activatorTable = "activators";
      } else if (kodeInfo.kode_produk === "B") {
        Activator = BActivator;
        activatorTable = "b_activators";
      } else if (kodeInfo.kode_produk === "E") {
        Activator = EActivator;
        activatorTable = "e_activators";
      } else if (kodeInfo.kode_produk === "G") {
        Activator = GActivator;
        activatorTable = "g_activators";
      } else if (kodeInfo.kode_produk === "K") {
        Activator = KActivator;
        activatorTable = "k_activators";
      } else if (kodeInfo.kode_produk === "P") {
        Activator = PActivator;
        activatorTable = "p_activators";
      } else if (kodeInfo.kode_produk === "U") {
        Activator = UActivator;
        activatorTable = "u_activators";
      } else if (kodeInfo.kode_produk === "NB") {
        Activator = NBActivator;
        activatorTable = "nb_activators";
      } else if (kodeInfo.kode_produk === "NP") {
        Activator = NPActivator;
        activatorTable = "np_activators";
      } else if (kodeInfo.kode_produk === "WB") {
        Activator = WbActivator;
        activatorTable = "wb_activators";
      } else if (kodeInfo.kode_produk === "WE") {
        Activator = WeActivator;
        activatorTable = "we_activators";
      } else if (kodeInfo.kode_produk === "WG") {
        Activator = WgActivator;
        activatorTable = "wg_activators";
      } else if (kodeInfo.kode_produk === "WK") {
        Activator = WkActivator;
        activatorTable = "wk_activators";
      } else if (kodeInfo.kode_produk === "WNB") {
        Activator = WnbActivator;
        activatorTable = "wnb_activators";
      } else if (kodeInfo.kode_produk === "WNP") {
        Activator = WnpActivator;
        activatorTable = "wnp_activators";
      } else if (kodeInfo.kode_produk === "WP") {
        Activator = WpActivator;
        activatorTable = "wp_activators";
      } else if (kodeInfo.kode_produk === "WU") {
        Activator = WuActivator;
        activatorTable = "wu_activators";
      } else if (kodeInfo.kode_produk === "WNN") {
        Activator = WnnActivator;
        activatorTable = "wnn_activators";
      } else if (kodeInfo.kode_produk === "NN") {
        Activator = NnActivator;
        activatorTable = "nn_activators";
      } else if (kodeInfo.kode_produk === "WNA") {
        Activator = WnaActivator;
        activatorTable = "wna_activators";
      } else if (kodeInfo.kode_produk === "NA") {
        Activator = NaActivator;
        activatorTable = "na_activators";
      } else if (kodeInfo.kode_produk === "WNF") {
        Activator = WnfActivator;
        activatorTable = "wnf_activators";
      } else if (kodeInfo.kode_produk === "NF") {
        Activator = NfActivator;
        activatorTable = "nf_activators";
      } else {
        Activator = TestActivator;
        activatorTable = "test_activators";
      }
      // console.log(kodeInfo.universitas)
      var sql = await Database.select("id", "blocked")
        .from(activatorTable)
        .where("serial_number", kodeInfo.serial_number);
      if (sql) {
        if (sql.length > 0) {
          if (sql[0].blocked == 1) {
            result.message = "Serial number ini di block";
            return response.status(403).json(result);
          }
          const kode = await Activator.find(sql[0].id);
          if (kode.device_id != null) {
            if (kode.device_id === kodeInfo.device_id) {
              if (kode.kode_produk === kodeInfo.kode_produk) {
                kode.nama = kodeInfo.nama;
                kode.email = kodeInfo.email;
                kode.phone = kodeInfo.phone;
                kode.device_id = kodeInfo.device_id;
                kode.universitas = kodeInfo.universitas;
                kode.active = 1;
                await kode.save();
                result.message = "success";
                result.result = kode;
                return response.status(200).json(result);
              }
            }
            result.message = "Serial number sudah pernah di registrasi";
            return response.status(401).json(result);
          }
          // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
          if (kode.kode_produk === kodeInfo.kode_produk) {
            // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
            // console.log(kodeInfo.universitas)
            kode.nama = kodeInfo.nama;
            kode.email = kodeInfo.email;
            kode.phone = kodeInfo.phone;
            kode.device_id = kodeInfo.device_id;
            kode.universitas = kodeInfo.universitas;
            kode.active = 1;
            await kode.save();
            result.message = "success";
            result.result = kode;
            return response.status(200).json(result);
          } else {
            result.message = "Serial number tidak sesuai dengan produk";
            return response.status(401).json(result);
          }
        } else {
          result.message = "Kode serial tidak dikenali";
          return response.status(401).json(result);
        }
      } else {
        result.message = "Kode serial tidak dikenali";
        return response.status(401).json(result);
      }
    } catch (e) {
      result.message = e.message;
      return response.status(401).json(result);
    }
  }

  async resetKode({ request, response }) {
    var result = new Object();
    var activatorTable = "";
    var Activator;
    const kodeInfo = request.only([
      "serial_number",
      "kode_produk",
      "device_id"
    ]);
    try {
      const data = await ActivatorName.findBy(
        "kode_produk",
        kodeInfo.kode_produk
      );
      if (data) {
        Activator = ProductActivator;
        activatorTable = "activators";
      } else if (kodeInfo.kode_produk === "B") {
        Activator = BActivator;
        activatorTable = "b_activators";
      } else if (kodeInfo.kode_produk === "E") {
        Activator = EActivator;
        activatorTable = "e_activators";
      } else if (kodeInfo.kode_produk === "G") {
        Activator = GActivator;
        activatorTable = "g_activators";
      } else if (kodeInfo.kode_produk === "K") {
        Activator = KActivator;
        activatorTable = "k_activators";
      } else if (kodeInfo.kode_produk === "P") {
        Activator = PActivator;
        activatorTable = "p_activators";
      } else if (kodeInfo.kode_produk === "U") {
        Activator = UActivator;
        activatorTable = "u_activators";
      } else if (kodeInfo.kode_produk === "NB") {
        Activator = NBActivator;
        activatorTable = "nb_activators";
      } else if (kodeInfo.kode_produk === "NP") {
        Activator = NPActivator;
        activatorTable = "np_activators";
      } else if (kodeInfo.kode_produk === "WB") {
        Activator = WbActivator;
        activatorTable = "wb_activators";
      } else if (kodeInfo.kode_produk === "WE") {
        Activator = WeActivator;
        activatorTable = "we_activators";
      } else if (kodeInfo.kode_produk === "WG") {
        Activator = WgActivator;
        activatorTable = "wg_activators";
      } else if (kodeInfo.kode_produk === "WK") {
        Activator = WkActivator;
        activatorTable = "wk_activators";
      } else if (kodeInfo.kode_produk === "WNB") {
        Activator = WnbActivator;
        activatorTable = "wnb_activators";
      } else if (kodeInfo.kode_produk === "WNP") {
        Activator = WnpActivator;
        activatorTable = "wnp_activators";
      } else if (kodeInfo.kode_produk === "WP") {
        Activator = WpActivator;
        activatorTable = "wp_activators";
      } else if (kodeInfo.kode_produk === "WU") {
        Activator = WuActivator;
        activatorTable = "wu_activators";
      } else if (kodeInfo.kode_produk === "WNN") {
        Activator = WnnActivator;
        activatorTable = "wnn_activators";
      } else if (kodeInfo.kode_produk === "NN") {
        Activator = NnActivator;
        activatorTable = "nn_activators";
      } else if (kodeInfo.kode_produk === "WNA") {
        Activator = WnaActivator;
        activatorTable = "wna_activators";
      } else if (kodeInfo.kode_produk === "NA") {
        Activator = NaActivator;
        activatorTable = "na_activators";
      } else if (kodeInfo.kode_produk === "WNF") {
        Activator = WnfActivator;
        activatorTable = "wnf_activators";
      } else if (kodeInfo.kode_produk === "NF") {
        Activator = NfActivator;
        activatorTable = "nf_activators";
      } else {
        Activator = TestActivator;
        activatorTable = "test_activators";
      }
      // console.log(kodeInfo.universitas)
      var sql = await Database.select("id", "blocked")
        .from(activatorTable)
        .where("serial_number", kodeInfo.serial_number);
      if (sql) {
        if (sql.length > 0) {
          if (sql[0].blocked == 1) {
            result.message = "Reset gagal serial number ini di block";
            return response.status(403).json(result);
          }
          const kode = await Activator.find(sql[0].id);
          if (kode.device_id == null) {
            result.message = "Reset gagal, device id belum terdaftar";
            return response.status(401).json(result);
          }
          if (kode.device_id !== kodeInfo.device_id) {
            result.message =
              "Reset gagal serial number device terdaftar berbeda";
            return response.status(401).json(result);
          }
          // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
          if (kode.kode_produk === kodeInfo.kode_produk) {
            // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
            // console.log(kodeInfo.universitas)
            kode.device_id = null;
            kode.active = 0;
            await kode.save();
            result.message = "success";
            result.result = kode;
            return response.status(200).json(result);
          } else {
            result.message =
              "Reset gagal serial number tidak sesuai dengan produk";
            return response.status(401).json(result);
          }
        } else {
          result.message = "Reset gagal kode serial tidak dikenali";
          return response.status(401).json(result);
        }
      } else {
        result.message = "Reset gagal kode serial tidak dikenali";
        return response.status(401).json(result);
      }
    } catch (e) {
      result.message = e.message;
      return response.status(401).json(result);
    }
  }

  async resetKodePc({ request, response }) {
    var result = new Object();
    var activatorTable = "";
    var Activator;
    const kodeInfo = request.only([
      "serial_number",
      "kode_produk",
      "device_id"
    ]);
    try {
      const data = await ActivatorName.findBy(
        "kode_produk",
        kodeInfo.kode_produk
      );
      if (data) {
        Activator = ProductActivator;
        activatorTable = "activators";
      } else if (kodeInfo.kode_produk === "B") {
        Activator = BActivator;
        activatorTable = "b_activators";
      } else if (kodeInfo.kode_produk === "E") {
        Activator = EActivator;
        activatorTable = "e_activators";
      } else if (kodeInfo.kode_produk === "G") {
        Activator = GActivator;
        activatorTable = "g_activators";
      } else if (kodeInfo.kode_produk === "K") {
        Activator = KActivator;
        activatorTable = "k_activators";
      } else if (kodeInfo.kode_produk === "P") {
        Activator = PActivator;
        activatorTable = "p_activators";
      } else if (kodeInfo.kode_produk === "U") {
        Activator = UActivator;
        activatorTable = "u_activators";
      } else if (kodeInfo.kode_produk === "NB") {
        Activator = NBActivator;
        activatorTable = "nb_activators";
      } else if (kodeInfo.kode_produk === "NP") {
        Activator = NPActivator;
        activatorTable = "np_activators";
      } else if (kodeInfo.kode_produk === "WB") {
        Activator = WbActivator;
        activatorTable = "wb_activators";
      } else if (kodeInfo.kode_produk === "WE") {
        Activator = WeActivator;
        activatorTable = "we_activators";
      } else if (kodeInfo.kode_produk === "WG") {
        Activator = WgActivator;
        activatorTable = "wg_activators";
      } else if (kodeInfo.kode_produk === "WK") {
        Activator = WkActivator;
        activatorTable = "wk_activators";
      } else if (kodeInfo.kode_produk === "WNB") {
        Activator = WnbActivator;
        activatorTable = "wnb_activators";
      } else if (kodeInfo.kode_produk === "WNP") {
        Activator = WnpActivator;
        activatorTable = "wnp_activators";
      } else if (kodeInfo.kode_produk === "WP") {
        Activator = WpActivator;
        activatorTable = "wp_activators";
      } else if (kodeInfo.kode_produk === "WU") {
        Activator = WuActivator;
        activatorTable = "wu_activators";
      } else if (kodeInfo.kode_produk === "WNN") {
        Activator = WnnActivator;
        activatorTable = "wnn_activators";
      } else if (kodeInfo.kode_produk === "NN") {
        Activator = NnActivator;
        activatorTable = "nn_activators";
      } else if (kodeInfo.kode_produk === "WNA") {
        Activator = WnaActivator;
        activatorTable = "wna_activators";
      } else if (kodeInfo.kode_produk === "NA") {
        Activator = NaActivator;
        activatorTable = "na_activators";
      } else if (kodeInfo.kode_produk === "WNF") {
        Activator = WnfActivator;
        activatorTable = "wnf_activators";
      } else if (kodeInfo.kode_produk === "NF") {
        Activator = NfActivator;
        activatorTable = "nf_activators";
      } else {
        Activator = TestActivator;
        activatorTable = "test_activators";
      }
      // console.log(kodeInfo.universitas)
      var sql = await Database.select("id", "blocked")
        .from(activatorTable)
        .where("serial_number", kodeInfo.serial_number);
      if (sql) {
        if (sql.length > 0) {
          if (sql[0].blocked == 1) {
            result.message = "Reset gagal serial number ini di block";
            return response.status(403).json(result);
          }
          const kode = await Activator.find(sql[0].id);
          if (kode.device_id == null) {
            result.message = "Reset gagal, device id belum terdaftar";
            return response.status(401).json(result);
          }
          if (kode.device_id !== kodeInfo.device_id) {
            result.message = "Reset gagal device id terdaftar tidak sesuai";
            return response.status(403).json(result);
          }
          if (kode.kode_produk === kodeInfo.kode_produk) {
            kode.device_id = null;
            kode.active = 0;
            await kode.save();
            result.message = "success";
            result.result = kode;
            return response.status(200).json(result);
          }
          result.message = "Reset gagal kode produk tidak sesuai";
          return response.status(401).json(result);
        } else {
          result.message = "Reset gagal kode serial tidak dikenali";
          return response.status(401).json(result);
        }
      } else {
        result.message = "Reset gagal kode serial tidak dikenali";
        return response.status(401).json(result);
      }
    } catch (e) {
      result.message = e.message;
      return response.status(401).json(result);
    }
  }

  async registerUserIos({ request, response }) {
    var result = new Object();
    var activatorTable = "";
    var Activator;
    var trialActivator;
    const kodeInfo = request.only([
      "member_id",
      "kode_produk",
      "nama",
      "email",
      "phone",
      "device_id",
      "universitas"
    ]);
    if (kodeInfo.member_id === "") {
      try {
        var id = 0;
        var initialId = 0;
        var getId = await Database.select("id")
          .from("trial_activators")
          .where("device_id", kodeInfo.device_id)
          .where("kode_produk", kodeInfo.kode_produk);
        if (getId.length > 0) {
          result.message =
            "Perangkat Anda sudah pernah terdaftar di aplikasi ini";
          return response.status(401).json(result);
        }
        var sql = await Database.select("AUTO_INCREMENT")
          .from("INFORMATION_SCHEMA.TABLES")
          .where("TABLE_SCHEMA", "AppActivator")
          .where("TABLE_NAME", "trial_activators");
        if (sql) {
          id = sql[0].AUTO_INCREMENT + initialId;
          trialActivator = new TrialActivator();
          trialActivator.kode_produk = kodeInfo.kode_produk;
          trialActivator.member_id = await this.generateMemberId();
          trialActivator.nomor_member = "TR-" + kodeInfo.kode_produk + "-" + id;
          trialActivator.nama = kodeInfo.nama;
          trialActivator.email = kodeInfo.email;
          trialActivator.phone = kodeInfo.phone;
          trialActivator.device_id = kodeInfo.device_id;
          trialActivator.universitas = kodeInfo.universitas;
          trialActivator.active = 1;
          trialActivator.blocked = 1;
          var newTrialActivator = await trialActivator.save();
          result.message = "success";
          result.result = trialActivator;
          return response.status(200).json(result);
        }
      } catch (e) {
        result.message = e.message;
        return response.status(401).json(result);
      }
    }
    try {
      const data = await ActivatorName.findBy(
        "kode_produk",
        kodeInfo.kode_produk
      );
      if (data) {
        Activator = ProductActivator;
        activatorTable = "activators";
      } else if (kodeInfo.kode_produk === "B") {
        Activator = BActivator;
        activatorTable = "b_activators";
      } else if (kodeInfo.kode_produk === "E") {
        Activator = EActivator;
        activatorTable = "e_activators";
      } else if (kodeInfo.kode_produk === "G") {
        Activator = GActivator;
        activatorTable = "g_activators";
      } else if (kodeInfo.kode_produk === "K") {
        Activator = KActivator;
        activatorTable = "k_activators";
      } else if (kodeInfo.kode_produk === "P") {
        Activator = PActivator;
        activatorTable = "p_activators";
      } else if (kodeInfo.kode_produk === "U") {
        Activator = UActivator;
        activatorTable = "u_activators";
      } else if (kodeInfo.kode_produk === "NB") {
        Activator = NBActivator;
        activatorTable = "nb_activators";
      } else if (kodeInfo.kode_produk === "NP") {
        Activator = NPActivator;
        activatorTable = "np_activators";
      } else if (kodeInfo.kode_produk === "WB") {
        Activator = WbActivator;
        activatorTable = "wb_activators";
      } else if (kodeInfo.kode_produk === "WE") {
        Activator = WeActivator;
        activatorTable = "we_activators";
      } else if (kodeInfo.kode_produk === "WG") {
        Activator = WgActivator;
        activatorTable = "wg_activators";
      } else if (kodeInfo.kode_produk === "WK") {
        Activator = WkActivator;
        activatorTable = "wk_activators";
      } else if (kodeInfo.kode_produk === "WNB") {
        Activator = WnbActivator;
        activatorTable = "wnb_activators";
      } else if (kodeInfo.kode_produk === "WNP") {
        Activator = WnpActivator;
        activatorTable = "wnp_activators";
      } else if (kodeInfo.kode_produk === "WP") {
        Activator = WpActivator;
        activatorTable = "wp_activators";
      } else if (kodeInfo.kode_produk === "WU") {
        Activator = WuActivator;
        activatorTable = "wu_activators";
      } else if (kodeInfo.kode_produk === "WNN") {
        Activator = WnnActivator;
        activatorTable = "wnn_activators";
      } else if (kodeInfo.kode_produk === "NN") {
        Activator = NnActivator;
        activatorTable = "nn_activators";
      } else if (kodeInfo.kode_produk === "WNA") {
        Activator = WnaActivator;
        activatorTable = "wna_activators";
      } else if (kodeInfo.kode_produk === "NA") {
        Activator = NaActivator;
        activatorTable = "na_activators";
      } else if (kodeInfo.kode_produk === "WNF") {
        Activator = WnfActivator;
        activatorTable = "wnf_activators";
      } else if (kodeInfo.kode_produk === "NF") {
        Activator = NfActivator;
        activatorTable = "nf_activators";
      } else {
        Activator = TestActivator;
        activatorTable = "test_activators";
      }
      // console.log(kodeInfo.universitas)
      var sql = await Database.select("id", "blocked")
        .from(activatorTable)
        .where("serial_number", kodeInfo.member_id);
      if (sql) {
        if (sql.length > 0) {
          if (sql[0].blocked == 1) {
            result.message = "Member ID / Serial ini di block";
            return response.status(403).json(result);
          }
          const kode = await Activator.find(sql[0].id);
          if (kode.device_id != null) {
            result.message = "Member ID / Serial sudah pernah di registrasi";
            return response.status(401).json(result);
          }
          // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
          if (kode.kode_produk === kodeInfo.kode_produk) {
            // console.log(kode.kode_produk + '=' + kodeInfo.kode_produk)
            // console.log(kodeInfo.universitas)
            kode.nama = kodeInfo.nama;
            kode.email = kodeInfo.email;
            kode.phone = kodeInfo.phone;
            kode.device_id = kodeInfo.device_id;
            kode.universitas = kodeInfo.universitas;
            kode.active = 1;
            await kode.save();
            result.message = "success";
            result.result = kode;
            return response.status(200).json(result);
          } else {
            result.message = "Member ID tidak sesuai dengan produk";
            return response.status(401).json(result);
          }
        } else {
          result.message = "Member ID tidak dikenali";
          return response.status(401).json(result);
        }
      } else {
        result.message = "Member ID tidak dikenali";
        return response.status(401).json(result);
      }
    } catch (e) {
      result.message = e.message;
      return response.status(401).json(result);
    }
  }

  async generateMemberId() {
    let ok = false;
    let member_id;
    while (!ok) {
      member_id = randomstring.generate({
        length: 6,
        charset: "alphanumeric",
        capitalization: "lowercase"
      });
      const trialId = await TrialActivator.findBy("member_id", member_id);
      if (!trialId) {
        ok = true;
        return member_id;
      }
    }
  }
}

module.exports = UpdateKodeController;
