<template>
  <div v-if="data_filter.form">
    <div
      class="modal fade"
      :class="data_filter.modal ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="triggerFilter" v-html="loading ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">
              <div class="row">
                <div class="form-group col-md-12">
                  <label for="perusahaan" class="form-label">Perusahaan</label>
                  <selectize id="perusahaan" v-model="data_filter.id_perusahaan" data-placeholder="Pilih Perusahaan" required @input="_getDepo($event); _getListPrincipal($event)" :disabled="loading">
                    <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.nama_perusahaan}}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="depo" class="form-label">Depo</label>
                  <selectize
                      id="depo"
                      v-model="data_filter.depo" 
                      data-placeholder="Pilih Depo" required :disabled="loading" :settings="selectizeConfig">
                    <option :value="d.id" v-for="(d, i) in depos" :key="i"> {{d.nama_depo}}</option>
                  </selectize>
                </div>
              </div>

              <div class="form-group">
                <label for="principal" class="form-label">Principal</label>
                <selectize  @input="_getBrand($event)" id="principal" v-model="data_filter.id_principal" data-placeholder="Pilih Principal" :settings="selectConfig" :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{ d.nama_principal }}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="brand" class="form-label">Brand</label>
                <selectize  id="brand"  @input="_getBarang($event)" v-model="data_filter.id_brand" data-placeholder="Pilih Brand" :settings="selectConfig" :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in brand" :key="i"> {{ d.nama_brand }}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="barang" class="form-label"
                  >Barang <span class="form-label-description p-cursor text-primary" @click="data_filter.id_barang = []">Hapus Semua</span>
                </label>
                <selectize id="barang" v-model="data_filter.id_barang" data-placeholder="Pilih Barang" :disabled="loading" :settings="selectConfig">
                  <option :value="d.id" v-for="(d, i) in barang" :key="i"> {{ d.kode_barang + " - " + d.nama_barang }}</option>
                </selectize>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="tanggal-mulai" class="form-label">Mulai Tanggal</label>
                  <input id="tanggal-mulai" type="date" class="form-control" required v-model="data_filter.start_date" :max="data_filter.end_date">
                </div>

                <div class="form-group col-md-6">
                  <label for="tanggal-selesai" class="form-label">Sampai Tanggal</label>
                  <input id="tanggal-selesai" type="date" class="form-control" required v-model="data_filter.end_date" :max="dateTime('ymd')">
                </div>
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary"  v-on:click="triggerFilter(); getLaporan();"  v-html="'OK'" />
            </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import helper from "@/assets/js/helper.js";

export default {
  name: "Modal",
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('monitoring_pareto', {
      data_filter : state => state.data_filter,
    }),
  },
  data() {
    return{
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      depos: [], salesman: [], perusahaan: [], principal:[], brand:[], barang:[],
    }
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepoByUser']),
    ...mapActions('brand', ['getListBrand']),
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('barang', ['getListBarangByBrand']),
    ...mapActions('monitoring_pareto', ['triggerFilter','getLaporan']),

    _getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },

    _getBrand(){
      this.getListBrand().then( res => {
        this.brand = res
      })
    },

    _getBarang(id) {
      this.getListBarangByBrand({id_brand : id}).then( res => {
        this.barang = res.data
      })
    },

    _getDepo(id){
      this.getListDepoByUser({id_perusahaan: id}).then( res => {
        this.depos = res
      })
    },

    _getListPrincipal(id){
      this.getListPrincipal({id_perusahaan: id}).then( res => {
        this.principal = res
      })
    },
  },
  mounted: function () {
    this._getListPerusahaan()
  },
};
</script>