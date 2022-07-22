<template>
   <div v-if="data_filter.form">
    <div class="modal fade"
      :class="data_filter.modal ? 'show':''"
      tabindex="-1"
      style="display: block"
      role="dialog"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="triggerFilter" v-html="loading ? spin() : ic('close')"/>
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
                      @input="getPrincipal()"
                  >
                    <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                      {{ row.nama_perusahaan }}
                    </option>
                  </selectize>
                </div>
              </div>

               <!--principal-->
              <div class="row">
                <div class="col-12 form-group">
                  <label class="form-label" for="principal">Principal</label>
                  <selectize
                      data-placeholder="Pilih Principal"
                      id="principal"
                      v-model="data_filter.id_principal"
                      :disabled="loading"
                      :settings="selectizeConfig"
                      required
                  >
                    <option :value="row.id" v-for="(row, i) in principal" :key="i">
                      {{ row.nama_principal }}
                    </option>
                  </selectize>
                </div>
              </div>

              <!-- status -->
              <div class="col-12 form-group">
                  <label for="status" class="form-label">Pilih Status</label>
                  <selectize v-model="data_filter.status" data-placeholder="Pilih Status" required id="status">
                    <option :value="d.v" v-for="(d, i) in [{l: 'Semua', v: 'semua'},{l: 'Belum Lunas', v: 'belum_lunas'},{l: 'Lunas', v: 'lunas'},{l: 'Over Due', v: 'over_due'}]" :key="i"> {{d.l}} </option>
                  </selectize>
              </div>

              <!--tanggal-->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="tanggal" class="form-label">Tanggal</label>
                  <input type="date" class="form-control" required v-model="data_filter.due_date" :max="dateTime('ymd')" id="tanggal">
                </div>
              </div>


            </div>
             
            <div class="modal-footer">
              <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
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
    ...mapState('pelunasan_pembelian', {
      data_filter : state => state.data_filter,
      data_laporan: state => state.data_laporan,
    }),
  },
  data() {
    return{
      perusahaan: [],
      principal: [],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    }
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('pelunasan_pembelian', ['get_laporan','triggerFilter']),

    getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },
    getPrincipal(){
      let payload = {
        'id_perusahaan' : this.data_filter.id_perusahaan, 
      };
      this.getListPrincipal(payload).then(res => {
        this.principal = res
      })
    }, 

    getLaporan(){
      this.triggerFilter();
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

<style lang="scss" src="../pelunasan.scss" scoped/>
