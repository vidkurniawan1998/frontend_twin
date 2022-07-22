<template>
  <div v-if="form_print.form">
    <div
      class="modal fade"
      :class="form_print.modal ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Faktur Pajak Pembelian</h5>
            <button type="button" class="close" v-on:click="triggerFormPrint" v-html="loading ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">
               <!-- Tanggal -->
              <div class="row">
               <div class="col-12 form-group">
                  <label for="tanggal" class="form-label">Tanggal</label>
                  <input
                      type="date"
                      class="form-control"
                      required
                      v-model="form_print.tanggal_faktur_pajak_pembelian" id="tanggal">
                </div>
              </div>

              <!-- No Faktur Pajak -->
              <div class="row">
               <div class="col-12 form-group">
                  <label for="no_faktur_pajak_pembelian" class="form-label">No Faktur Pajak Pembelian</label>
                  <input
                      type="text"
                      class="form-control"
                      required
                      v-model="form_print.faktur_pajak_pembelian" id="no_faktur_pajak_pembelian">
                </div>
              </div>

            </div>
             
            <div class="modal-footer">
              <button type="button" class="btn btn-white"  v-on:click="triggerFormPrint" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary" v-on:click="_print()" v-html="loading ? spin() : 'Simpan'"/>
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
    ...mapState('retur', {
      form_print : state => state.form_print,
    }),
  },
  data() {
    return{

    }
  },

  methods: {
    ...mapMutations('retur', ['SET_UPDATED']),
    ...mapActions('retur', ['triggerFormPrint','setFakturPembelian']),
    _print(){
      this.SET_UPDATED(false)
      this.setFakturPembelian().then( res => {
        this.toast("Berhasil diperbarui")
        this.triggerFormPrint()
      }).catch(err => {
          this.onError(err)
      })
    }
  },
  mounted: function () {
  },
  created(){
  }
};
</script>

