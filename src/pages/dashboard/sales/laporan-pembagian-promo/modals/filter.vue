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
        <div class="modal-content ">
          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="triggerFilter" v-html="loading ? spin() : ic('close')"/>
          </div>

          <div class="modal-body pt-3">

            <!--perusahaan-->
            <div class="row">
              <div class="form-group col-md-12">
                <label for="perusahaan" class="form-label">Perusahaan</label>
                <selectize @input=" _getListPrincipal()" id="perusahaan" v-model="data_filter.id_perusahaan" data-placeholder="Pilih Perusahaan" required :disabled="loading" :settings="selectizeConfig">
                  <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.nama_perusahaan}}</option>
                </selectize>
              </div>
            </div>

            <!--principal-->
            <div class="row">
              <div class="form-group col-md-12">
                <label for="principal" class="form-label">Principal</label>
                <selectize id="principal" v-model="data_filter.id_principal" data-placeholder="Pilih Principal" required :disabled="loading" 
                :settings="selectizeConfig">
                  <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}}</option>
                </selectize>
              </div>
            </div>

            <!--tipe promo-->
            <div class="row">
              <div class="form-group col-md-12">
                <label for="tipe_promo" class="form-label">Tipe Promo</label>
                <selectize id="tipe_promo" v-model="data_filter.tipe_promo" data-placeholder="Pilih Promo" required :disabled="loading"
                :settings="selectizeConfig">
                  <option :value="d" v-for="(d, i) in tipe_promo" :key="i"> {{ucwords(d.replace("_", " "))}}</option>
                </selectize>
              </div>
            </div>

            <!--tanggal-->
            <div class="row">
              <div class="col-6 form-group">
                <label class="form-label" for="end-date">Mulai Tanggal</label>
                <input id="tanggal" type="date" class="form-control" required v-model="data_filter.start_date" :max="data_filter.end_date" />
              </div>
              <div class="col-6 form-group">
                <label class="form-label" for="end-date">Sampai Tanggal</label>
                <input id="tanggal" type="date" class="form-control" required v-model="data_filter.end_date"/>
              </div>
            </div>


          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary"  v-on:click="getLaporan(); triggerFilter()"  v-html="'OK'" />
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
    ...mapState('pembagian_promo', {
      data_filter : state => state.data_filter,
    }),
  },
  data() {
    return {
      perusahaan : [], 
      principal  : [],
      tipe_promo : ['on_faktur','off_faktur'],
      tipe_so : ['Day','Week'],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    };
  },
  methods: {
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('pembagian_promo', ['triggerFilter','getLaporan']),
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('principal', ['getListPrincipal']),

    _getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },

    _getListPrincipal(){
      this.getListPrincipal({id_perusahaan: this.data_filter.id_perusahaan}).then( res => {
        this.principal = res
      })
    },
  },
  mounted(){
    this._getListPerusahaan()
  },
};
</script>