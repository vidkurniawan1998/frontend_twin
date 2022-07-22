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
          <form>
            <div class="modal-body default">

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
                      @input="_getDepo(); _getBrand()"
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
                  <selectize 
                  v-model="data_filter.id_depo" 
                  data-placeholder="Pilih Depo" 
                  :settings="selectizeConfig" 
                  required 
                  :disabled="loading"
                  >
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}}
                    </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="brand" class="form-label">Principal</label>
                  <selectize
                      id="principal"
                      v-model="data_filter.id_principal"
                      data-placeholder="Pilih Principal" 
                      required
                      :disabled="loading"
                      >
                    <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="brand" class="form-label">Brand</label>
                  <selectize
                      id="brand"
                      v-model="data_filter.id_brand"
                      data-placeholder="Pilih Brand" 
                      required 
                      :disabled="loading"
                      >
                    <option :value="d.id" v-for="(d, i) in brand" :key="i"> {{d.nama_brand}} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label class="form-label">Mulai Tanggal</label>
                  <input type="date" class="form-control" required v-model="data_filter.start_date" :max="data_filter.end_date">
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label">Sampai Tanggal</label>
                  <input type="date" class="form-control" required v-model="data_filter.end_date" :max="dateTime('ymd')">
                </div>
              </div>

            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary" :disabled="data_filter.id_brand==0 || loading" v-on:click="triggerFilter(); getLaporan();"  v-html="'OK'" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";
export default {
  name: "FormFilter",
  mixins: [helper],
  data(){
    return{
      perusahaan: [],
      depos     : [],
      principal : [],
      brand     : [],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    }
  },
  computed: {
     ...mapState(['loading']),
     ...mapState('kpi', {
      data_filter : state => state.data_filter,
      data_laporan: state => state.data_laporan,
    }), 
  }, 
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo', 'getListDepoById']),
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('brand', ['getListBrand']),
    ...mapActions('kpi', ['getLaporan','triggerFilter']),
    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },
    _getDepo(id){
      this.getListDepo({id_perusahaan: id}).then( res => {
        this.depos = res
      })
    },
    _getPrincipal(id){
      this.getListPrincipal({}).then( res => {
        this.principal = res
      })
    },
    _getBrand(id){
      this.getListBrand({filter: false, perPage: 'all', id_perusahaan:id}).then( res => {
        this.brand = res;
      })
    },
  },
  mounted: function () {
    this._getPerusahaan()
    this._getPrincipal()
  }
}
</script>

<style scoped>
</style>