<template>
  <div v-if="data_filter.form">
    <div
      class="modal fade"
      :class="data_filter.form ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="data_filter.form=false" v-html="loading ? spin() : ic('close')"/>
          </div>
            <div class="modal-body pt-3">
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
                      @input="getDepo()"
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
                      required :disabled="loading"
                      @input="getSalesman()"
                      >
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}}
                    </option>
                  </selectize>
                </div>
              </div>

              <!--salesman-->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="salesman" class="form-label">Pilih Salesman</label>
                  <selectize v-model="data_filter.id_salesman" data-placeholder="Pilih Salesman" required id="salesman">
                    <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                  </selectize>
                </div>
              </div>

               <!--status-->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="status" class="form-label">Pilih Status</label>
                  <selectize v-model="data_filter.status" data-placeholder="Pilih Status" required id="status">
                    <option :value="d" v-for="(d, i) in status" :key="i"> {{d}} </option>
                  </selectize>
                </div>
              </div>

              <!--tanggal-->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="tanggal" class="form-label">Tanggal</label>
                  <input type="date" class="form-control" required v-model="data_filter.due_date" id="tanggal">
                </div>
              </div>


            </div>
             
            <div class="modal-footer">
              <button type="button" class="btn btn-white"  v-on:click="data_filter.form=false" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary"  v-on:click="getLaporan()"  v-html="'OK'" />
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
    ...mapState('invoice_note', {
      data_filter : state => state.data_filter,
      data_laporan: state => state.data_laporan,
    }),
  },
  data() {
    return{
      perusahaan: [],
      salesman: [], 
      depos: [],
      status : ['all','belum_dikunjungi','dikunjungi'],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    }
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('invoice_note', ['get_laporan']),

    getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },
    
    getDepo(){
      this.getListDepo({filter: false, id_perusahaan: this.data_filter.id_perusahaan}).then( res => {
        this.depos = res
      })
    },

    getSalesman() {
      const url = 'salesman/list/by_depo/';
      this.axios.get(url+this.data_filter.id_depo).then((response) => {
         this.salesman = response.data.data
      })
    },

    getLaporan(){
      this.data_filter.form = false;
      this.get_laporan();
    },
  },
  watch: {

  },
  mounted: function () {
  },
  created(){
    this.getListPerusahaan();
  }
};
</script>
