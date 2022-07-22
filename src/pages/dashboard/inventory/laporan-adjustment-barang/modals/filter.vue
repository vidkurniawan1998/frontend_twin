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
                      v-model="data_filter.id_perusahaan"
                      data-placeholder="Pilih Perusahaan"
                      required 
                      @input="getDepo()"
                      :disabled="loading">
                    <option :value='d.id' v-for="(d, i) in data_perusahaan" :key="i"> {{d.nama_perusahaan}}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label class="form-label">Nama Depo</label>
                  <selectize
                      v-model="data_filter.id_depo"
                      data-placeholder="Pilih Depo"
                      required
                      :disabled="loading">
                    <option :value='d.id' v-for="(d, i) in data_depo" :key="i"> {{d.nama_depo}}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label class="form-label">Nama Gudang</label>
                  <selectize
                      v-model="data_filter.id_gudang"
                      data-placeholder="Pilih Gudang"
                      required
                      :disabled="loading">
                    <option :value='d.id' v-for="(d, i) in data_gudang" :key="i"> {{d.nama_gudang}}</option>
                  </selectize>
                </div>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Pilih Status</label>
                <selectize v-model="data_filter.status" data-placeholder="Pilih Status" required>
                  <option :value="d" v-for="(d, i) in ['all','waiting','canceled','approved']" :key="i"> {{ d }} </option>
                </selectize>
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
      data_perusahaan:[],
      data_depo:[],
      data_gudang:[],
    }
  },
  computed: {
     ...mapState(['loading']),
     ...mapState('adjustment_barang', {
      data_filter : state => state.data_filter,
    }),
  }, 
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('adjustment_barang', ['getLaporan']),
    ...mapActions('gudang', ['getListGudang']),
    getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.data_perusahaan = res
      })
    },
    getDepo(){
      this.getListDepo({filter: false, id_perusahaan: this.data_filter.id_perusahaan}).then( res => {
        this.data_depo = res
      })
    },
    getGudang() {
      this.getListGudang({}).then( res => {
        this.data_gudang = res
      })
    },
  },
  created(){
    this.getPerusahaan();
    this.getGudang();
  },
}
</script>

<style scoped>

</style>
