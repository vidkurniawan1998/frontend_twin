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
            <!--grouping-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label">Grouping</label>
                <selectize
                data-placeholder="Pilih Tipe Group"
                v-model="data_filter.tipe_group"
                :disabled="loading"
                :settings="selectizeConfig"
                required
                >
                  <option :value="row" v-for="(row, i) in tipe_group" :key="i">
                    {{row}}
                  </option>
                </selectize>
              </div>
            </div>

            <!--perusahaan-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label" for="perusahaan">Perusahaan</label>
                <selectize
                data-placeholder="Pilih Perusahaan"
                id="perusahaan"
                v-model="data_filter.id_perusahaan"
                :disabled="loading"
                :settings="selectizeConfig"
                required
                @input="_getDepo($event);"
                >
                <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                  {{ row.nama_perusahaan }}
                </option>
              </selectize>
            </div>
            </div>

            <!--depo-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label">Depo</label>
                <selectize v-model="data_filter.id_depo" data-placeholder="Pilih Depo" :settings="selectizeConfig" required :disabled="loading">
                <option :value="row.id" v-for="(row, i) in depos" :key="i">
                  {{row.nama_depo}}
                </option>
              </selectize>
              </div>
            </div>

            <!--grouping-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label">Mitra</label>
                <selectize v-model="data_filter.id_mitra" data-placeholder="Pilih Mitra" required :disabled="loading">
                  <option value=" ">INCLUDE</option>
                  <option value="0">EXCLUDE</option>
                  <option :value="row.id" v-for="(row, i) in mitra" :key="i">
                    {{row.perusahaan}}
                  </option>
                </selectize>
              </div>
            </div>

            <div class="form-group">
              <label for="tanggal" class="form-label">Tanggal</label>
              <div class="row">
                <div class="col-6">
                  <input id="start-date" type="date" class="form-control" required v-model="data_filter.start_date" :max="dateTime('ymd')" />
                </div>
                <div class="col-6">
                  <input id="end-date" type="date" class="form-control" required v-model="data_filter.end_date" :max="dateTime('ymd')" />
                </div>
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
              <selectize   @input="_getListBarang()" id="brand" v-model="data_filter.id_brand" data-placeholder="Pilih Brand" :settings="selectConfig" :disabled="loading">
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

          </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary"  v-on:click="triggerFilter(); getLaporan();"  v-html="'Oke'" />
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
      ...mapState('gross_profit', {
        data_filter : state => state.data_filter,
        data_laporan : state => state.data_laporan,
      }),
    },
    data() {
      return{
        tipe_keyword_res : '',
        keyword_res : '',

        perusahaan: [],
        depos: [],
        gudang : [],
        principal : [],
        brand : [],
        barang : [],
        mitra : [],
        tipe_group : [
        'Barang',
        'Segmen',
        'Brand',
        'Principal',
        'Tim',
        'Toko',
        'Depo',
        'Perusahaan',
        ],   
        selectizeConfig: {
          maxItems: 99,
          plugins: ["remove_button"]
        },
      }
    },

    methods: {
      ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
      ...mapActions('depo', ['getListDepo']),
      ...mapActions('principal', ['getListPrincipal']),
      ...mapActions('brand', ['getListBrand']),
      ...mapActions('barang', ['getListBarangByBrand']),
      ...mapActions('mitra', ['getListMitra']),
      ...mapActions('gross_profit', ['triggerFilter','getLaporan']),

      _getPerusahaan() {
        this.getListPerusahaanByAccess().then( res => {
          this.perusahaan = res
        })
      },


      _getDepo(id){
        this.getListDepo({filter: false, id_perusahaan: id}).then( res => {
          this.depos = res
        })
      },

      _getPrincipal() {
        this.getListPrincipal({}).then( res => {
          this.principal = res
        })
      },

      _getMitra(){
        this.getListMitra().then( res => {
          this.mitra = res
        })
      },

      _getListBarang() {
        this.getListBarangByBrand({id_brand : this.data_filter.id_brand}).then( res => {
          this.barang = res.data
          let id_barang = [];
        })
      },

      _getBrand(){
        this.getListBrand().then( res => {
          this.brand = res
        })
      },
    },
    mounted() {
      this._getPerusahaan();
      this._getPrincipal();
      this._getMitra();
    },
    created(){
    }
  };
</script>

