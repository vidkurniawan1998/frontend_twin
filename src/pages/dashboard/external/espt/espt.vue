<template>

    <div class="antialiased">

        <Sidebar/>

        <div class="page">

            <Header :disabledSearch="true"/>

            <div class="center">

                <div class="last-number" :class="file != null && noPajak == '' ? 'focus' : ''">
                  <li>
                      <b>NOMOR PAJAK</b>
                      <br />
                      <small>NO. PAJAK TERAKHIR</small>
                  </li>
                  <li>
                    <div class="fg">
                      <label>FG Pengganti</label>
                      <input type="text" maxlength="3" class="number" v-model="fpPengganti"/>
                    </div>

                    <div class="kpp">
                      <label>Header Faktur</label>
                      <input type="text" maxlength="3" class="number" v-model="kodePajakPerusahaan"/>
                    </div>

                    <div class="np">
                      <label>Nomor Faktur</label>
                      <input type="text" maxlength="10" class="number" @keyup="$event.keyCode == 13 ? _convert() : false" v-model="noPajak" autofocus/>
                    </div>
                  </li>

                  <i class="la la-lg la-random btn-switch" @click="_relocate"></i>
                </div>

                <div class="text-center child">
                <div :style="!progress.start ? 'color: #333' : 'color: #fff'">
                    <h3 class="m-0">Selamat Datang</h3>
                    <p>Silahkan pilih file excel pada input dibawah ini</p>
                </div>

                <div class="input-excel">
                    <i
                    class="file fa"
                    :class="status == null ? 'fa fa-file-o' : status == 201 ? 'fa-check text-success' : 'fa-file-o text-danger'"
                    ></i>
                    <div class="input-group">
                    <input
                        type="text"
                        readonly
                        class="form-control"
                        v-model="filename"
                        placeholder="Pilih file excel"
                        @click="progress.start ? null : $refs.file.click()"
                    />
                    <span class="input-group-append">
                        <button
                        class="btn btn-primary"
                        :disabled="file == null || converted && !finish"
                        type="button"
                        @click="_convert"
                        >OK</button>
                    </span>
                    </div>

                    <input type="file" class="d-none" @change="_selectFile" ref="file" accept=".xlsx" />
                    <div class="text-left" v-if="alert != null">
                    <span v-html="alert" class="text-danger small"></span>
                    </div>

                    <transition name="slide-fade-y">
                    <div class="text-left" v-if="converted || finish">
                        <ul class="m-0 p-4">
                        <li>
                            Menyiapkan data excel
                            <i
                            :class="!progress.prepareDoc ? 'fa fa-spin fa-spinner' : 'fa fa-check text-green'"
                            class="ml-1"
                            ></i>
                            <i></i>
                        </li>
                        <li>
                            Menyiapkan data espt
                            <i
                            :class="!progress.toEspt ? 'fa fa-spin fa-spinner' : 'fa fa-check text-green'"
                            class="ml-1"
                            ></i>
                            <i></i>
                        </li>
                        </ul>
                    </div>
                    </transition>
                </div>

                <transition name="slide-fade-y">
                    <div v-if="progress.toEspt">
                    <div class="mt-3 mb-2 text-success">File excel berhasil dikonvert!</div>
                    <p>
                        <i class="fa fa-download mr-1"></i> Download Sebagai
                    </p>

                    <div class="custom-btn-group">
                        <button class="btn btn-success" @click="_download">Excel</button>

                        <!-- <vue-json-to-csv separator=";" :csv-title="'data-espt-'+date" :json-data="csv.data" :labels="csv.labels">
                                        <button class="btn btn-secondary"> Csv </button>
                        </vue-json-to-csv>-->
                        <JsonCSV
                        class="btn btn-primary"
                        delimiter=";"
                        :name="'data-espt-'+date+'.csv'"
                        :data="csv.data"
                        >Csv</JsonCSV>
                    </div>
                    </div>
                </transition>
                </div>

            </div>

        </div>
    </div>

</template>

<script>
import XLSX from "xlsx";
import VueJsonToCsv from "vue-json-to-csv"; // https://www.npmjs.com/package/vue-json-to-csv
import JsonCSV from "vue-json-csv";

import helper from "@/assets/js/helper.js";
import {mapActions} from "vuex";

export default {
  name: "pajak",
  components: { VueJsonToCsv, JsonCSV },
  mixins: [helper],
  data() {
    return {
      status: null,
      alert: null,
      file: null,
      filename: null,
      converted: false,
      finish: false,

      progress: {
        start: false,
        prepareDoc: false,
        toEspt: false,
        finish: false
      },

      kodePajakPerusahaan: "0",
      noPajak: "",
      countNoPajak: null,
      invoiceSelected: null, // no. invoice yang diproses

      head: [],
      dataEspt: {},

      date: null,
      csv: {
        labels: {},
        data: []
      },

      fpPengganti: 0
    };
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('reference', ['getReferenceByCode']),
    _relocate(){
      this.noPajak = ''

      if(this.fpPengganti == 0){
        this.fpPengganti = 1
        this.kodePajakPerusahaan = ''
      }else{
        this.fpPengganti = 0
        this.getKodePajakPerusahaan()
        document.getElementsByClassName("number")[2].focus();
      }
    },

    getKodePajakPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        let perusahaan = res[0].kode_perusahaan || ""
        let code = 'no_pajak_'+perusahaan.toLowerCase()
        this.getReferenceByCode({code: code}).then(res => {
          this.kodePajakPerusahaan = res.data.value
        })
      })
    },

    _selectFile(event) {
      this.date = new Date()
        .toLocaleDateString()
        .split("/")
        .join("-"); // set date
      let input = event.target,
        file = input.files[0];

      if (file) {
        document.getElementsByClassName("number")[2].focus();

        if (file.size >= 10985795) {
          this.file = null;
          this.status = 500;
          this.alert =
            "Oops! File ini terlalu besar untuk diproses, (" +
            this.formatBytes(file.size) +
            ")";
        } else {
          this.status = 201;
          this.alert = null;
          this.file = file;
          this.filename = file.name;
        }
      }
    },

    _convert() {

      if(this.file == null){
        this.$refs.file.click()
        return;
      }

      this.converted = true;
      this.finish = false;

      this.dataEspt = {}; // clear data espt
      this.progress.start = true;
      this.progress.prepareDoc = false;
      this.progress.toEspt = false;

      let self = this;

      setTimeout(() => {
        let reader = new FileReader();
        reader.onload = function() {
          var fileData = reader.result;
          var wb = XLSX.read(fileData, { type: "binary" });

          wb.SheetNames.forEach(function(sheetName) {
            // 1. KONVERSI EXCEL KE JSON
            var rowObj = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName],
              { header: 0, defval: "" }
            );

            // convert object key to lowercase
            var objs = [];
            for (let i = 0; i < rowObj.length; i++) {
              objs.push(
                Object.fromEntries(
                  Object.entries(rowObj[i]).map(([k, v]) => [
                    k.toLowerCase(), v
                  ])
                )
              );

              // if(i == 5) break
            }

            for (const key in objs[0]) {
              self.head.push(key);
            }

            self.data = objs;
            self.progress.prepareDoc = true;

            // 2. KONVERSI JSON KE EXCEL ESPT

            // urutkan data by number -> kode depo
            let sorted = objs
            // let sorted = objs.sort((a, b) => {
            //   return a.number
            //     .split(".")[1]
            //     .localeCompare(b.number.split(".")[1]);
            // });

            // buat method untuk set data tanpa perlu ketik key berulang x
            let keyLabels = [
              "FK",
              "KD_JENIS_TRANSAKSI",
              "FG_PENGGANTI",
              "NOMOR_FAKTUR",
              "MASA_PAJAK",
              "TAHUN_PAJAK",
              "TANGGAL_FAKTUR",
              "NPWP",
              "NAMA",
              "ALAMAT_LENGKAP",
              "JUMLAH_DPP",
              "JUMLAH_PPN",
              "JUMLAH_PPNBM",
              "ID_KETERANGAN_TAMBAHAN",
              "FG_UANG_MUKA",
              "UANG_MUKA_DPP",
              "UANG_MUKA_PPN",
              "UANG_MUKA_PPNBM",
              "REFERENSI"
            ];

            function _sheet(data) {
              let key = keyLabels,
                res = {};

              for (let i = 0; i < key.length; i++) {
                res[key[i]] = data[i];
              }

              return res;
            }

            // set header data excel espt
            self.dataEspt = {
              sheet: [
                _sheet([
                  "LT",
                  "NPWP",
                  "NAMA",
                  "JALAN",
                  "BLOK",
                  "NOMOR",
                  "RT",
                  "RW",
                  "KECAMATAN",
                  "KELURAHAN",
                  "KABUPATEN",
                  "PROPINSI",
                  "KODE_POS",
                  "NOMOR_TELEPON",
                  "",
                  "",
                  "",
                  "",
                  ""
                ]),
                _sheet([
                  "OF",
                  "KODE_OBJEK",
                  "NAMA",
                  "HARGA_SATUAN",
                  "JUMLAH_BARANG",
                  "HARGA_TOTAL",
                  "DISKON",
                  "DPP",
                  "PPN",
                  "TARIF_PPNBM",
                  "PPNBM",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  ""
                ])
              ]
            };

            // set data
            self.countNoPajak = Number(self.noPajak) + 1; // set nomor faktur

            // console.log(sorted)

            for (let i = 0; i < sorted.length; i++) {
              let _ = sorted[i];

              let jmlDpp = 0, jmlPpn = 0

              // kalkulasi
              for (let l = 0; l < sorted.length; l++) {
                let row = sorted[l]

                if (row.number == _.number) {

                  let dpp = +row.subtotal - +row.diskon

                  jmlDpp += dpp

                  jmlPpn += +row.ppn.toFixed(2)

                }
              }

              // jika invoice selected != invoice, set nilai invoice baru & buat FK
              if (_["number"] != self.invoiceSelected) {
                self.invoiceSelected = _["number"]; // set invoice baru

                let np = (''+self.kodePajakPerusahaan)+""+self.countNoPajak++; // join kode pajak perusahaan & nomor faktur + 1

                let dpp = _["subtotal"] - _["diskon"],
                  ppnbm = +dpp;

                let ppn = +_["ppn"];

                // digunakan jika format tanggal adalah format yang berasal dari excel (bukan string)
                // let jsDate = self.excelDateToJSDate(_['transdate']);
                // let d = jsDate.getDate(),
                //     m = jsDate.getMonth(),
                //     y = jsDate.getFullYear(),
                //     transdate = (d.toString().length == 1 ? '0'+d : d)+'/'+(m.toString().length == 1 ? '0'+m : m)+'/'+y;

                let transdate = self.dateFormat(_["transdate"] + "|dmy", "/");

                // console.log(Math.floor(jmlPpn.toFixed(2)))


                self.dataEspt.sheet.push(
                  // set data
                  _sheet([
                    "FK", //fk
                    "01", //kdjenistrannsaksi
                    self.fpPengganti, //fgpengganti
                    self.fpPengganti == 0 ? np : (_.no_pajak.substring(4).replace('.','').replace('-','')).toString()+'', //nomorfaktur
                    _["bulan"], //masapajak
                    _["tahun"], //tahunpajak
                    transdate, //tanggalfaktur
                    (_["npwp"] == 0 || _["npwp"] == null ? '000000000000000' : _["npwp"]), //npwp
                    _.namapkp == null || _.namapkp == '' ? _["outname"] : _.namapkp, //nama
                    // _["address"], //alamatlengkap (jika alamat pkp null -> address : alamat_pkp) -> request by rizki
                    _.namapkp == null || _.namapkp == '' ? _.address : _.alamatpkp,

                    // Math.floor(jmlDpp), //Math.round(ppnbm), //jumlahdpp
                    Math.floor(jmlDpp.toFixed(2)),
                    Math.floor(jmlPpn.toFixed(2)), //Math.round(ppn), //jumlahppn
                    0, //jumlahppnbm
                    "", //idketerangantambahan
                    0, //fguangmuka
                    0, //uangmukadpp
                    0, //uangmukappn
                    0, //uangmukappnbm
                    _["number"] +
                      " | " +
                      self.dateFormat(_["transdate"] + "|dmy", "/") +
                      " | " +
                      _["team"] +
                      " | " +
                      _["nopo"]
                  ])
                );
              }



                // buat OF
                let dpp = 0;
                dpp++;

                // jika pcs == 0 ? hs = ht, jika pcs > 0 ? hs = ht * volume
                let hs =
                  _["qtypcs"] == 0
                    ? _["hargatrans"]
                    : _["hargatrans"] / _["volume"];

                // jika pcs == 0 ? jmlb = qtydus, jika pcs > 0 ? jmlb = dus * volume + pcs
                let jmlB =
                  _["qtypcs"] == 0
                    ? _["qtydus"]
                    : _["qtydus"] * _["volume"] + _["qtypcs"];

                self.dataEspt.sheet.push(
                  // set data
                  _sheet([
                    "OF", //of
                    _["itemcode"], //kodeobjek
                    _["segmen"], //nama barang
                    hs.toFixed(2), //hargasatuan
                    jmlB, //jumlahbarang
                    _["subtotal"].toFixed(2), //hargatotal
                    _["diskon"].toFixed(2), //diskon
                    (_["subtotal"] - _["diskon"]).toFixed(2), //dpp
                    _["ppn"].toFixed(2), //ppn
                    0, //tarifppnbm
                    0, // ppnbm
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                  ])
                );

              // if(i >= 10){ break; }
            }

            // #KONVERSI JSON UNTUK CSV
            keyLabels.forEach(k => {
              self.csv.labels[k] = { title: k };
            });

            self.csv.data = self.dataEspt.sheet;

            // let sheet = self.dataEspt.sheet

            // for (let i = 0; i < sheet.length; i++) {
            //   let item = sheet[i]
            //   console.log(item.FG_PENGGANTI)

            // }

            setTimeout(() => {
              self.progress.start = false;
              self.progress.toEspt = true;
              self.finish = true;
            }, 1000);
          });
        };
        reader.readAsBinaryString(this.file);
        // console.log(d)
      }, 500);
    },

    _download() {
      let date = new Date()
        .toLocaleDateString()
        .split("/")
        .join("-");

      var data = XLSX.utils.json_to_sheet(this.dataEspt.sheet);
      var wb = XLSX.utils.book_new(); // make Workbook of Excel
      XLSX.utils.book_append_sheet(wb, data, "sheet"); // sheetAName is name of Worksheet
      XLSX.writeFile(wb, "data-espt-" + date + ".xlsx");
    }
  },

  mounted() {
    let input = document.querySelectorAll(".number");

    input.forEach(function(el, index, array) {
      el.addEventListener("keypress", e => {
        if ((e.which != 8 && e.which != 0 && e.which < 48) || e.which > 57) {
          e.preventDefault();
        }
      });
    });

    // let n = Math.floor(155874.00)
    // console.log(n)
  },
  created() {
    this.getKodePajakPerusahaan()
  }
};
</script>

<style lang="scss" scoped>
    .center {
        height: calc(100vh - 55px);
        position: relative;
        background-color: #fff;

        .child {
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-right: -50%;
            transform: translate(-50%, -50%);

            img{
            height: 270px !important;
            width: 310px;
            }
        }
    }

    .input-excel{
        position: relative;

        input{
            padding-left: 35px !important;
            width: 350px !important;
        }

        i.file{
            position: absolute;
            left: 1px;
            padding: 11px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9;
        }
    }

    .progress{
        position: absolute;
        left: 50%; top: 0; height: 400px !important;
        transform: translate(-50%, -50%);
    }

    .last-number{
        position: absolute;
        left: 15px; top: 15px;
        border: 3px #ccc solid;
        border-radius: 5px;
        // overflow: hidden;
        width: 280px;
        z-index: 3;

    &.focus{
        animation: animateFocus 1s infinite;
        animation-direction: alternate;
    }

    li{
        list-style: none;
        position: relative;
        text-align: center;

        &:first-child{
            padding: 5px 15px;
        }

        div{
          display: inline-block;
          overflow: hidden;
          margin-top: 6px;
          // border-right: 1px #ddd solid;

          &.fg{
              width: 60px;
          }

          &.kpp{
              width: 60px;
              border-left: 1px #ccc solid;
          }

          &.np{
              width: calc(100% - 120px);
              border-left: 1px #ccc solid;
          }

          label{
            position: absolute;
            bottom: -60px;
            opacity: 0;
            transition: .2s;
            background-color: #333;
            border-radius: 3px;
            color: #fff;
            pointer-events: none;
            transition-delay: .2s;

            &::after{
              content: '';
              position: absolute;
              left: 15%;
              top: -10px;
              border-width: 5px;
              border-style: solid;
              border-color: transparent transparent #333 transparent;
            }
          }

          &:hover{
            label{
              opacity: 1;
              bottom: -50px;
              padding: 5px 10px;
            }
          }

          input{
              border: none;
              outline: none;
              display: inline-block;
              padding: 0px 15px;
          }
        }

        &:first-child{
          border-bottom: 1px #ccc solid;
          background-color: #f5f5f5;
          line-height: 14px;

          small{
              font-size: 11px;
          }
        }
    }

    p{
        margin: 0;
    }
    }

    @keyframes animateFocus {
        from{
            // background: rgba(176, 202, 236, 0.05);
            // width: 300px; height: 300px;
            // left: 150px; top: 0px;
            border: 3px #ccc solid;
            box-shadow: 0 0px 0px #ddd;
        }

        to{
            border: 3px rgba(101, 155, 216, 0.5) solid;
            box-shadow: 0 3px 10px #ddd;

            // width: 500px; height: 500px;
            // left: 130px; top: -230px;
            // background: rgba(101, 155, 216, 0.5);
        }
    }

    .custom-btn-group{
        button{
            width: 100px;
            margin: 0 5px;
        }
    }

    .btn-back{
        position: fixed;
        top: 15px;
        right: 15px;
    }

    .copyright{
        position: fixed;
        bottom: 15px; left: 15px;
        font-size: 13px;
    }

    .btn-switch{
      position: absolute;
      right: -60px;
      bottom: 0px;
      border-radius: 50%;
      background-color: #e5e5e5;
      padding: 14px 11px;
      width: 40px; height: 40px;
      color: #333; transition: .2s;

      &:hover{
        cursor: pointer;
        background-color: #f5f5f5;
      }
    }
</style>
