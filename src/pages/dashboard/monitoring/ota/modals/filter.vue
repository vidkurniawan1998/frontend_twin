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
                  <selectize id="perusahaan" v-model="data_filter.id_perusahaan" data-placeholder="Pilih Perusahaan" required @input="_getDepo($event);" :disabled="loading">
                    <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.nama_perusahaan}}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="depo" class="form-label">Depo</label>
                  <selectize
                      id="depo"
                      v-model="data_filter.id_depo" 
                      data-placeholder="Pilih Depo" required :disabled="loading" @input="_getSalesman()" :settings="selectizeConfig">
                    <option :value="d.id" v-for="(d, i) in depos" :key="i"> {{d.nama_depo}}</option>
                  </selectize>
                </div>
              </div>

              <!--salesman-->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="salesman" class="form-label">Pilih Salesman</label>
                  <selectize
                      :settings="selectizeConfig"
                      v-model="data_filter.id_salesman"
                      data-placeholder="Pilih Salesman"
                      required
                      :disabled="loading"
                      id="salesman">
                    <option value="all"> Semua Tim </option>
                    <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                  </selectize>
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
    ...mapState('monitoring_ota', {
      data_filter : state => state.data_filter,
    }),
  },
  data() {
    return{
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      depos: [], perusahaan: [], salesman: [],
    }
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('monitoring_ota', ['triggerFilter','getLaporan']),

    _getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },

    _getDepo(id){
      this.getListDepo({filter: false, id_perusahaan: id}).then( res => {
        this.depos = res
      })
    },

    _getSalesman(){
      this.getListSalesman(
        {
          id_perusahaan: this.data_filter.id_perusahaan,
          depo: this.data_filter.id_depo
        }).then( res => {
        this.salesman = res
      })
    },

  },
  mounted: function () {
    this._getListPerusahaan()
  },
};
</script>