<template>
  <div v-if="data_filter.form">
    <div class="modal fade"
      tabindex="-1"
      style="display: block"
      role="dialog"
      v-if="data_filter.form"
      :class="data_filter.form ? 'show':''"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" @click="data_filter.form = false" v-html="ic('close')"/>
          </div>
          <form>
            <div class="modal-body default">
              <div class="row">
                <div class="form-group col-md-12">
                  <label for="perusahaan" class="form-label">Perusahaan</label>
                  <selectize
                      id="perusahaan"
                      v-model="data_filter.perusahaan"
                      data-placeholder="Pilih Perusahaan"
                      required 
                      @input="getDepo()"
                      :disabled="loading">
                    <option :value='d.id+"-"+d.nama_perusahaan' v-for="(d, i) in data_perusahaan" :key="i"> {{d.nama_perusahaan}}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label class="form-label">Nama Depo</label>
                  <selectize
                      v-model="data_filter.depo"
                      data-placeholder="Pilih Depo"
                      required
                      @input="getTim()"
                      :disabled="loading">
                    <option :value='d.id+"-"+d.nama_depo' v-for="(d, i) in data_depo" :key="i"> {{d.nama_depo}}</option>
                  </selectize>
                </div>
              </div>
              
              <div class="row">
                <div class="form-group col-md-12">
                  <label for="tim" class="form-label">Salesman</label>
                  <selectize
                      id="tim"
                      v-model="data_filter.tim"
                      data-placeholder="Pilih Team"
                      required 
                      @input="getNamaTim()"
                      :disabled="loading">
                    <option value="">Semua Tim</option>
                    <option :value='d.id_tim+"-"+d.tim+"-"+d.nama_salesman' v-for="(d, i) in data_tim" :key="i">{{d.nama_salesman}} ({{d.tim}})</option>
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
              <button
                  @click="data_filter.form = false"
                  type="button"
                  class="btn btn-white"
                  v-html="'Tutup'" />
              <button
                  @click="getLaporan(); data_filter.form=false"
                  :disabled="loading"
                  type="button"
                  class="btn btn-primary"
                  v-html="'Oke'"
              />
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
      data_depo : [],
      data_tim : [],
      data_perusahaan : [],
    }
  },
  computed: {
     ...mapState(['loading']),
     ...mapState('retur_segmen', {
      data_filter : state => state.data_filter,
    }), 
  }, 
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('retur_segmen', ['getLaporan']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('depo', ['getListDepo']),

    getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.data_perusahaan = res
      })
    },
    getDepo(){
      let perusahaan_split = this.data_filter.perusahaan.split('-');
      this.data_filter.id_perusahaan   = perusahaan_split[0];
      this.data_filter.nama_perusahaan = perusahaan_split[1];
      this.getListDepo({filter: false, id_perusahaan: this.data_filter.id_perusahaan}).then( res => {
        this.data_depo = res
      })
    },

    getTim(){
      const url = 'salesman/list/by_depo/';
      let depo_split = this.data_filter.depo.split('-');
      this.data_filter.id_depo   = depo_split[0];
      this.data_filter.nama_depo = depo_split[1];
      this.axios.get(url+this.data_filter.id_depo).then((response) => {
         this.data_tim = response.data.data
      })
    },

    getNamaTim(){
      let tim_split = this.data_filter.tim.split('-');
      this.data_filter.id_tim        = tim_split[0];
      this.data_filter.nama_tim      = tim_split[1];
      this.data_filter.nama_salesman = tim_split[2];
    }
  },
  created(){
    this.getListPerusahaan();
  },
}
</script>

<style scoped>

</style>
