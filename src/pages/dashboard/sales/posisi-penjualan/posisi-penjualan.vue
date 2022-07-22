<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Posisi/Koordinat Penjualan
                </h2>
              </div>
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto">
                    <button class="btn btn-white ml-3" v-html="ic('filter')" @click="_filter"> </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="card">
              <gmap-map
                  :center="center"
                  :zoom="10"
                  style="width: 100%; height: 600px"

              >
                <gmap-marker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :label="``"
                    labelClass = 'labels'
                    :opacity="0.2"
                ></gmap-marker>
              </gmap-map>
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
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter";
export default {
  name: "posisi-penjualan.vue",
  mixins: [helper],
  components: { FormFilter },
  data() {
    return {
      markers: [],
      center: {},
      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },
      dataFilter: {
        tipe_salesman: 'all',
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd')
      }
    }
  },
  methods: {
    getDataPosition() {
      this.markers = []
      this.axios.get('penjualan/list/posisi_penjualan', {
        params: this.dataFilter
      }).then( res => {
        let rspn = res.data
        for (let i = 0; i < rspn.length; i++) {
          this.markers.push(
              {
                position: {
                  lat: +rspn[i].latitude,
                  lng: +rspn[i].longitude
                }
              }
          )
        }
        this.center = {lat: -8.3592587, lng: 115.1788703}
      }).catch( err => {
        this.onError(err)
      })
    },
    _filter(){
      this.filter.config = {view: true, title: 'Filter'}
      this.filter.action = (formData) => {
        for (const key in formData) {
          this.dataFilter[key] = formData[key]
        }

        this.getDataPosition()
      }
    },
  },
  created() {
    this.getDataPosition()
  }
}
</script>

<style scoped>
</style>