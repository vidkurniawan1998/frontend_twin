<template>
  <div class="antialiased">
    <Sidebar/>

    <div class="page">

      <Header hint="Ketik no. acc"/>

      <div class="content">
        <div class="container">
          <!-- Title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Delivery Penjualan
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto">
                    <button
                        class="btn btn-info ml-3"
                        v-html="loading ? spin() : ic('refresh')"
                        @click="_get"
                        :disabled="loading"
                    >
                    </button>
                    <button class="btn btn-white ml-3" v-html="ic('filter')" @click="_filter"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <!-- Body -->
          <div class="box">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped" v-if="!loading">
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Tgl PO</th>
                      <th>No. Invoice</th>
                      <th>Qty</th>
                      <th>Value</th>
                      <th style="max-width: 20%">Toko</th>
                      <th>Salesman</th>
                      <th>Pembayaran</th>
                      <th class="pos-relative">
                        <label class="form-check" style="position: absolute; top: 4px; right: 10px">
                          <input class="form-check-input" type="checkbox" :checked="data.length == checkeds.length" @click="_checkUncheck">
                          <span class="form-check-label"></span>
                        </label>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i">
                      <td> {{ i+1 }} </td>
                      <td>{{dateFormat(row.tanggal)}}</td>
                      <td class="click-able text-primary" @click="_detail(row)">
                        <div>{{row.no_invoice}}</div>
                        <hr style="margin: 2px"/>
                        <div class="text-muted"> PO:{{ row.id }}</div>
                      </td>
                      <td style="font-size: 20px;font-weight: bold">
                            <span class="badge bg-blue" :class="{ 'bg-danger': row.sum_qty < 3, 'bg-blue': row.sum_qty >= 3 }">
                              {{ row.total_qty }} / {{ row.total_pcs }}
                            </span>
                      </td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ ribuan(row.grand_total.toFixed(0)) }}
                        </div>
                      </td>
                      <td :class="row.status_verifikasi === 'N' ? 'text-danger' : ''">
                        <div>[{{row.no_acc}}] {{row.nama_toko}}</div>
                        <hr style="margin: 2px"/>
                        <div class="text-muted">{{ row.alamat }}</div>
                      </td>
                      <td :title="row.nama_salesman">{{row.nama_tim}}</td>
                      <td>{{row.tipe_pembayaran}}</td>
                      <td class="text-right pos-relative">
                        <label class="form-check" style="position: absolute; top: 50%; transform: translate(0, -50%); right: 10px">
                          <input class="form-check-input" type="checkbox" :value="row.id" v-model="checkeds">
                          <span class="form-check-label"></span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <transition-group class="btn-position" name="slide-fade-y" >
              <button
                  class="btn btn-danger btn-pill"
                  style="margin-right: 10px;"
                  v-if="checkeds.length > 0"
                  @click="_tandai_terkirim"
                  :disabled="loading"
                  :key="1"
              >
                <i class="la la-lg la-clock-o mr-1"></i> Delivery {{checkeds.length}} Penjualan
              </button>
              <button
                  class="btn btn-primary btn-pill"
                  v-if="checkeds.length > 0"
                  :disabled="loading"
                  :key="2">
                <i class="la la-lg la-clock-o mr-1"></i> Print {{checkeds.length}} Penjualan
              </button>
            </transition-group>
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

    <MarkSent
        :config.sync="mark_sent.config"
        :initData="mark_sent.data" :dismiss.sync="mark_sent.dismiss"
        :isSubmit.sync="mark_sent.isSubmit"
        @submit="mark_sent.action"
    />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import MarkSent from "./modals/mark-sent";
export default {
  name: "delivery-penjualan.vue",
  mixins: [helper],
  components: { FormFilter, MarkSent },
  data() {
    return {
      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },
      mark_sent: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },
      dataFilter: {
        status: 'approved',
        id_salesman: 'all',
        start_date: '2020-08-18', //this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        qty: 0,
        keyword: '',
        depo:[],
        distribusi_penjualan:''
      },
      loading: false,
      data: [], checkeds:[]
    }
  },
  methods: {
    _get() {
      this.loading = true
      this.axios.get("penjualan/distribusi/penjualan",{params: this.dataFilter}).then(res => {
        this.loading = false;
        this.data = res.data.data
        // animasi penjualan baru
        if(this.reload > 1){
          this.animate = 'animate bounceIn'
          setTimeout(() => { this.animate = '' }, 1000);
        }

        if(this.reload < 2){
          this.reload += 1
        }
      }).catch( err => {
        this.loading = false
        this.onError(err)
      });
    },
    _check(id){
      let io = this.checkeds.indexOf(id)

      if(this.checkeds.indexOf(id) > -1){
        this.checkeds.splice(io, 1)
      }else{
        this.checkeds.push(id)
      }
    },

    _checkUncheck(){
      if(this.checkeds.length != this.data.length){
        this.checkeds = []
        for (let i = 0; i < this.data.length; i++) {
          let item = this.data[i]
          this.checkeds.push(item.id)
        }
      }else{
        this.checkeds = []
      }
    },
    _filter(){
      this.filter.config = {view: true, title: 'Filter'}
      this.filter.action = (formData) => {
        for (const key in formData) {
          this.dataFilter[key] = formData[key]
        }
        if(this.dataFilter.id_salesman === '')
        {
          this.dataFilter.id_salesman = 'all'
        }
        this._get()
      }
    },
    _tandai_terkirim() {
      let id = this.checkeds;
      this.loading = true;
      this.mark_sent.config = {view: true, title: 'Penjualan Terkirim'}
      this.mark_sent.data = id
      this.mark_sent.action = (formData) => {
        this.mark_sent.isSubmit = true

        this.axios.post(`penjualan/distribusi/bulk_deliver`, formData).then(res => {
          this.toast('Penjualan berhasil dikirim')
          this.checkeds = []
          this._get();
          this.loading = false
          this.mark_sent.isSubmit = false
        }).catch( err => {
          this.onError(err)
          this.loading = false
          this.mark_sent.isSubmit = false
        });
      }
    },
  },
  created() {
    // this._get()
  }
}
</script>

<style scoped>
.btn-position{
  position: fixed;
  right: 15px;
  bottom: 15px;
}

.navbar-text {
  padding-top: 0.5rem!important;
}

.nav-item {
  width: 20%;
}

.navbar-text.info {
  width: 60%;
}

.btn-pill-left{
  border-top-left-radius: 20px 20px;
  border-bottom-left-radius: 20px 20px;
  border-top-right-radius: 0px 0px;
  border-bottom-right-radius: 0px 0px;
}
.btn-pill-right{
  border-top-left-radius: 0px 0px;
  border-bottom-left-radius: 0px 0px;
  border-top-right-radius: 20px 20px;
  border-bottom-right-radius: 20px 20px;  }
.fade-in-table {
  animation: fadeIn 1s;
  -webkit-animation: fadeIn 1s;
  -moz-animation: fadeIn 1s;
  -o-animation: fadeIn 1s;
  -ms-animation: fadeIn 1s;
}
@keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-moz-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-webkit-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-o-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-ms-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}
</style>