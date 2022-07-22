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
                  v-model="data_filter.depo" 
                  data-placeholder="Pilih Depo" 
                  :settings="selectizeConfig" 
                  required 
                  :disabled="loading"
                  @input="getSalesman()"
                  >
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}}
                    </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="salesman" class="form-label">Nama Salesman</label>
                  <selectize
                      id="salesman"
                      v-model="data_filter.id_salesman"
                      data-placeholder="Pilih Salesman" required :disabled="loading">
                    <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
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
      perusahaan: [],
      depos: [],
      salesman :[],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    }
  },
  computed: {
     ...mapState(['loading']),
     ...mapState('omset_toko', {
      data_filter : state => state.data_filter,
    }), 
  }, 
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('omset_toko', ['getLaporan']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('salesman', ['getListSalesman']),
    getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },
    getDepo(){
      this.getListDepo({
        id_perusahaan : this.data_filter.id_perusahaan
      }).then( res => {
        this.depos = res
      })
    },
    getSalesman(){
      this.getListSalesman({depo: this.data_filter.depo}).then( res => {
        this.salesman = res
      })
    },
  },
  created(){
    this.getListPerusahaan();
  },
}
</script>

<style scoped>
</style>