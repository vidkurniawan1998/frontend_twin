<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header hint="Cari" :enabled="false"/>

      <div class="content">
        <div class="container">
          <!-- Page Header -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Jurnal Penjualan
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>
                  <div class="col-auto">
                    <button
                        class="btn btn-white"
                        v-html="ic('filter')+' Filter'"
                        @click="_filter">
                    </button>
                    <button
                        @click="print"
                        :disabled="data.data.length == 0 || isPrint"
                        class="btn btn-primary ml-3"
                        v-html="ic('printer')+' Cetak'">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Page Loading -->
          <Skeleton
              type="table"
              :length="10"
              class="mt-3 bg-white" v-if="loading"/>

          <!-- No Data -->
          <Nodata v-if="!loading && data.data.length == 0"/>
          <div class="box" v-if="!loading && data.data.length > 0">
            <div class="card">
              <!-- Table Header -->
              <div class="table-responsive">
                <table class="table table-no-break jurnal">
                  <tbody>
                    <tr>
                      <td style="width: 30%">
                        <h2>{{ data.perusahaan }} ({{ data.depo }})</h2>
                      </td>
                      <td class="text-center">
                        <h2 v-html="dataFilter.tipe_pembayaran == 'credit' ? 'BUKTI PENJUALAN' : 'BUKTI KAS MASUK PENJUALAN'"></h2>
                      </td>
                      <td>
                        <span v-html="dataFilter.tipe_pembayaran == 'credit' ? `BPJ: ${data.no_bpj}` : `BKM: ${data.no_bpj}`"></span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        Salesman: {{ data.salesman }}
                      </td>
                      <td>
                        Tanggal: {{ data.tanggal }}
                        <br>
                        Lampiran: &nbsp; Lembar:
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="table">
                  <thead>
                    <tr>
                      <td class="text-center">Tgl</td>
                      <td class="text-center">Account</td>
                      <td class="text-center" colspan="2">Customer</td>
                      <td class="text-center">Debet</td>
                      <td class="text-center">Kredit</td>
                    </tr>
                    <tr v-for="(dt, i) in data.data" :key="i">
                      <td class="text-center">{{ dt.tanggal }}</td>
                      <td>{{ dt.no_acc }}</td>
                      <td>{{ dt.nama_toko }}
                        <span v-if="dt.npwp !== null">
                          <br>{{ dt.npwp }}
                        </span>
                      </td>
                      <td>
                          {{ dt.no_invoice }}
                      </td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ dt.total | currency }}
                        </div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>POTONGAN PENJUALAN TEAM: {{ data.salesman }}</td>
                      <td></td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ data.potongan | currency }}
                        </div>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>PENJUALAN TEAM: {{ data.salesman }}</td>
                      <td></td>
                      <td>
                      </td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ data.dpp | currency }}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>PPn</td>
                      <td></td>
                      <td>
                      </td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ data.ppn | currency }}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ data.debet | currency }}
                        </div>
                      </td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ data.kredit | currency }}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6">
                        Terbilang: {{ data.terbilang }}
                      </td>
                    </tr>
                  </thead>
                </table>
                <table class="table table-no-break jurnal">
                  <tbody>
                    <tr>
                      <td class="text-center">Input Data</td>
                      <td class="text-center">Disetujui</td>
                      <td class="text-center" colspan="2">Diperiksa</td>
                      <td class="text-center">Dibuat</td>
                    </tr>
                    <tr style="height: 100px">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td class="text-center">Operator</td>
                      <td class="text-center">Pimpinan</td>
                      <td class="text-center">Acct. Manager</td>
                      <td class="text-center">Spv. Acct</td>
                      <td class="text-center">Staff Admin</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="row">
                <div class="col-12">
                  <h2>REKAP PENJUALAN</h2>
                  <p style="font-size: 14px;font-weight: bold">Total {{ data.salesman }}: {{ data.value | currency }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FormFilter
        :config.sync="filter.config"
        :initData="filter.data" :dismiss.sync="filter.dismiss"
        :isSubmit.sync="filter.isSubmit"
        @submit="filter.action"
    />

  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import FormFilter from "./modals/filter";
export default {
  name: "JurnalPenjualan",
  mixins: [helper],
  components: { FormFilter },
  data() {
    return {
      data: {
        data: [],
        perusahaan: '',
        salesman: '',
        tanggal: '',
        no_bpj: ''
      },
      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },
      dataFilter: {
        id_salesman: [],
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'cash',
        depo: [],
        id_mitra: '-',
      },
      loading: false,
      isPrint: false
    }
  },
  methods: {
    _filter(){
      this.filter.config = {view: true, title: 'Filter'}
      this.filter.action = (formData) => {
        for (const key in formData) {
          this.dataFilter[key] = formData[key]
        }
        this._get()
      }
    },
    _get() {
      this.loading = true

      let dataForm = {
        id_salesman: this.dataFilter.id_salesman,
        start_date: this.dataFilter.start_date,
        end_date: this.dataFilter.end_date,
        depo: this.dataFilter.depo,
        tipe_pembayaran: this.dataFilter.tipe_pembayaran,
        id_mitra: this.dataFilter.id_mitra
      }
      if(this.dataFilter.id_salesman != '')
      {
        this.axios.get("jurnal/penjualan",{params: dataForm}).then(res => {
          this.loading = false;
          if (typeof res.data.data != 'undefined' && res.data.data.length > 0) {
            this.data = res.data
          } else {
            this.onError('Tidak ada data')
            this.data=  {
              data: [],
                  perusahaan: '',
                  salesman: '',
                  tanggal: '',
                  no_bpj: ''
            }
          }
        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      }
      else{
        this.loading = false;
      }
    },
    print() {
      this.isPrint = true
      localStorage.setItem("jurnal_penjualan", JSON.stringify(this.data))
      window.open(window.location.origin+'/dashboard/sales/print-jurnal-penjualan', '_blank')
      this.isPrint = false
    }
  }
}
</script>

<style scoped>
  .jurnal tr td {
    border: 2px solid black;
  }
</style>