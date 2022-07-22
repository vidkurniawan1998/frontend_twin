<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header hint="Cari nama salesman"/>

      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Tarik Penjualan Kino
                </h2>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="row">
              <div class="col-6">
                <div class="row row-cards">
                  <div class="col-12" v-for="(slsman, i) in salesman">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="bg-default avatar" style="border-radius: 4px">
                              {{ slsman.nama_tim }}
                            </span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium" style="text-transform: uppercase">
                              {{ slsman.nama }}
                            </div>
                            <div class="text-muted">
                              {{ slsman.kode_eksklusif }} - {{ slsman.nama_depo }}
                            </div>
                          </div>
                          <div class="col-auto">
                            <input
                                type="date"
                                class="form-control"
                                v-model="salesman[i].tanggal">
                          </div>
                          <div class="col-auto">
                            <span
                                :class="{ 'disable-click' : loading }"
                                @click="importData(slsman, i)"
                                style="cursor: pointer"
                                class="bg-danger text-white avatar"
                                v-html="loaded == i && loading ? spin() : ic('download')">
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card">
                  <div class="card-header">
                    <div class="card-title">
                      Response
                    </div>
                  </div>
                  <div class="card-body p-0">
                    <ul class="list-group borderless">
                      <li class="list-group-item" v-for="(ggl, i) in gagal">
                        <strong>{{ ggl.order }}</strong> - {{ ggl.remark }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import helper from "@/assets/js/helper";
import $axios from "@/api";
export default {
  name: "order-kino.vue",
  mixins: [helper],
  data() {
    return {
      salesman: [],
      gagal: [],
      loaded: '',
    }
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('salesman', ['getListSalesmanPrincipal']),
    importData(slsman, i) {
      if (this.loading) {
        return;
      }

      this.gagal = []
      this.loaded = i
      $axios.get('import/penjualan_kino', {
        params: slsman
      }).then( res => {
        this.loaded = ''
        if (typeof res.data.jumlah != 'undefined' && res.data.jumlah) {
          this.gagal = res.data.data
        }
      })
    }
  },
  created() {
    this.getListSalesmanPrincipal({}).then( res => {
      this.salesman = []
      let lengthOfResult = res.length
      for (let i = 0; i<lengthOfResult; i++) {
        let dt    = res[i]
        dt.tanggal= new Date().toISOString().slice(0,10)
        this.salesman.push(dt)
      }
    })
  }
}
</script>

<style scoped lang="scss" src="./order-kino.scss"></style>